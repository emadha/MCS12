import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {useDropzone} from 'react-dropzone';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faFileImage,
    faMultiply,
    faSpinner,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {isArray, parseInt} from 'lodash';
import {usePage} from '@inertiajs/react';
import {AppContext} from '@/AppContext';
import toast from 'react-hot-toast';

export default function UploadDropzone({
    files = [],
    currentStep,
    clearErrors,
    setStepError,
    uploadRef,
    maxFileSize,
    MAX_FILES = 12,
    setFiles,
}) {
    const {csrf_token} = usePage().props;
    const [dragenter, setDragenter] = useState(false);
    const {lang} = useContext(AppContext);

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(
            file => file.preview && URL.revokeObjectURL(file.preview));
    }, []);

    const removeFile = useCallback((name) => {
        const fileToRemove = files.find(file => file.name === name);
        if (fileToRemove?.xhr) fileToRemove.xhr.abort();
        setFiles(prevState => prevState.filter(file => file.name !== name));
    }, [files, setFiles]);

    const setPrimary = useCallback((name) => {
        setFiles(prevState => prevState.map(file => ({
            ...file,
            is_primary: file.name === name,
        })));
        toast(lang('This is the primary photo now'));
    }, [setFiles, lang]);

    useEffect(() => {
        clearErrors('photos');
        setStepError(currentStep, []);
    }, [files[0]?.progress]);

    const handleUploadFile = useCallback((file) => {
        const photo = {
            id: null,
            name: file.name,
            is_primary: false,
            file: file,
            percentage: 0,
            inProgress: false,
            error: null,
        };

        // Check file count limit
        if (files.length >= MAX_FILES) {
            toast.error(lang('Too many files'), {position: 'bottom-left'});
            return null;
        }

        // Check for duplicate files
        if (files.find(_file => _file.name === file.name)) {
            toast.error(lang('Photo already added'), {position: 'bottom-left'});
            return null;
        }

        // Create XHR request
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('p', file);
        formData.append('_token', csrf_token);

        // Set up the photo object
        photo.xhr = xhr;
        photo.preview = URL.createObjectURL(file);

        // Handle upload progress
        xhr.upload.onprogress = (e) => {
            const percentage = parseInt((e.loaded / e.total) * 100);
            setFiles(prevFiles => prevFiles.map(p =>
                p.name === photo.name ? {...p, percentage, inProgress: true} : p,
            ));
        };

        // Handle state changes
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;

            let updatedPhoto;

            switch (xhr.status) {
                case 200: {
                    if (xhr.response) {
                        try {
                            const jsonParsed = JSON.parse(xhr.response);
                            updatedPhoto = {
                                ...photo,
                                status: 1,
                                success: 1,
                                inProgress: false,
                                id: jsonParsed.photo || null,
                            };
                        } catch (ex) {
                            console.error('Error parsing successful response:',
                                ex);
                        }
                    }
                    break;
                }
                case 400:
                case 500: {
                    try {
                        const jsonParsed = JSON.parse(xhr.response);
                        updatedPhoto = {
                            ...photo,
                            status: -1,
                            success: 0,
                            inProgress: false,
                            error: Object.values(jsonParsed),
                        };
                    } catch (ex) {
                        console.error('Error parsing error response:', ex);
                    }
                    break;
                }
                default: {
                    updatedPhoto = {
                        ...photo,
                        status: -1,
                        inProgress: false,
                        success: 0,
                    };
                }
            }

            if (updatedPhoto) {
                setFiles(prevFiles =>
                    prevFiles.map(
                        p => p.name === updatedPhoto.name ? updatedPhoto : p),
                );
            }
        };

        // Add the file to state before sending
        setFiles(prevFiles => [...prevFiles, photo]);

        // Send the request
        xhr.open('POST', route('photos.upload'), true);
        xhr.send(formData);

        return photo;
    }, [files, setFiles, MAX_FILES, lang, csrf_token]);

    const {getRootProps, getInputProps} = useDropzone({
        maxFiles: MAX_FILES,
        minSize: 1,
        onDropRejected: useCallback((files) => {
            files.forEach(file => {
                file.errors.forEach(error =>
                    toast.error(lang(error.message), {position: 'bottom-left'}),
                );
            });
        }, [lang]),

        onDropAccepted: useCallback(acceptedFiles => {
            setStepError(currentStep, []);
            clearErrors();
            acceptedFiles.forEach(handleUploadFile);
        }, [setStepError, currentStep, clearErrors, handleUploadFile]),

        onDragEnter: useCallback(() => setDragenter(true), []),
        onDragLeave: useCallback(() => setDragenter(false), []),
        onDrop: useCallback(() => {
            setDragenter(false);
            setStepError(currentStep, []);
        }, [setStepError, currentStep]),
        onError: useCallback(() => {}, []),
        accept: {'image/*': []},
    });

    const FileItem = useCallback(({file}) => (
        <div className={'lg:w-1/4 md:w-1/3 sm:w-1/2 w-full p-2'}
             key={file.name}>
            <div
                className={`cursor-pointer shadow transition-all p-1 rounded border overflow-hidden bg-white dark:bg-neutral-900 relative group ${file.is_primary
                    ? 'border-4 border-blue-500'
                    : 'border-transparent'}`}
                onClick={() => !file.is_primary && setPrimary(file.name)}
                tabIndex={1}
            >
                <img
                    className={'relative aspect-square rounded-sm w-full object-cover -indent-96 overflow-hidden'}
                    src={file.preview || file.path?.square_sm}
                    alt={file.name}
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                        if (file.preview) URL.revokeObjectURL(file.preview);
                    }}
                />
                <div className={'absolute z-10 right-5 top-2'}>
                    <FontAwesomeIcon
                        className={'opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all p-4 px-5 text-xl rounded bg-inherit text-inherit hover:bg-black hover:text-white hover:dark:bg-black cursor-pointer'}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.name);
                        }}
                        icon={faTrash}
                    />
                </div>

                <div
                    className={'absolute left-0 top-0 w-full h-full flex items-center justify-center'}>
                    <div className={'p-5 text-center transition-all'}>
                        <FontAwesomeIcon
                            icon={file.inProgress ? faSpinner : (file.status ===
                            1 ? faCheck : faMultiply)}
                            spin={file.inProgress}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (file.status !== 1) removeFile(file.name);
                            }}
                            className={`text-2xl aspect-square text-white backdrop-blur-sm p-2 rounded-full ${file.status ===
                            1
                                ? 'bg-lime-500/50'
                                : 'bg-orange-700/50 cursor-pointer'}`}
                        />

                        {file.error && file.error.length ? (
                            <span
                                className={'absolute text-xs w-full left-0 bottom-0 p-2 bg-black/70'}>
                                {file.error?.map(e => e
                                    ? isArray(e) ? e?.join('\n') : e
                                    : '')}
                            </span>
                        ) : null}

                        {file.inProgress && (
                            <div
                                className={'font-serif text-center text-2xl rounded shadow-sm mt-1'}>
                                {file.percentage}%
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ), [setPrimary, removeFile]);

    const thumbs = useMemo(() =>
            files.map(file => <FileItem file={file} key={file.name}/>),
        [files, FileItem]);

    const dropzoneContent = useMemo(() => {
        if (files.length === 0) {
            return (
                <>
                    <div
                        className={'text-neutral-200 select-none transition-all dark:group-hover:text-white group-hover:text-lime-800 dark:text-neutral-600 relative'}>
                        {lang(
                            'Drag \'n\' drop some files here, or click to select files')}
                    </div>
                    <FontAwesomeIcon
                        icon={faFileImage}
                        className={`absolute text-8xl animate-tilt transition-all select-none z-0 ${dragenter
                            ? 'opacity-100 text-orange-500'
                            : 'opacity-10'}`}
                    />
                </>
            );
        }
        return null;
    }, [files.length, dragenter, lang]);

    return (
        <section className={'container min-h-[350px] relative'}>
            <div
                {...getRootProps()}
                ref={uploadRef}
                className={'absolute inset-0 cursor-pointer group hover:text-lime-700 dark:hover:text-white w-full flex items-center justify-center'}
            >
                <input {...getInputProps()} />
                {dropzoneContent}
            </div>
            <div
                className={'-mx-4 flex flex-wrap items-stretch justify-center h-full'}>
                {thumbs}
            </div>
        </section>
    );
}
