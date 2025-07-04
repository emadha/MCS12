import React, {useContext, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck, faFileImage, faMultiply, faSpinner, faTrash} from '@fortawesome/free-solid-svg-icons'
import {parseInt} from 'lodash'
import {usePage} from '@inertiajs/react'
import {AppContext} from '@/AppContext'
import toast from 'react-hot-toast'

export default function UploadDropzone ({
    files = [],
    currentStep,
    clearErrors,
    setStepError,
    uploadRef, maxFileSize, MAX_FILES = 12, setFiles,
}) {
    const csrf_token = usePage().props.csrf_token
    const [dragenter, setDragenter] = useState(false)
    const { lang } = useContext(AppContext)

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview))
    }, [])

    const removeFile = (name) => {
        files.find(file => file.name === name).xhr?.abort()
        setFiles(prevState => prevState.filter(file => file.name !== name))
    }

    const setPrimary = (name) => {
        setFiles(prevState => prevState.map(file => {
            file.is_primary = false
            if (file.name === name) {
                file.is_primary = true
                toast(lang('This is the primary photo now'))
            }
            return file
        }))
    }

    useEffect(() => {
        clearErrors('photos')
        setStepError(currentStep, [])
    }, [files[0]?.progress])

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: MAX_FILES,
        minSize: 1,
        onDropRejected: (files, e) => {
            for (const file of files) {
                file.errors.map(r => toast.error(lang(r['message'], { position: 'bottom-left' })))
            }
        },
        onDropAccepted: acceptedFiles => {
            setStepError(currentStep, [])
            clearErrors()
            for (const file of acceptedFiles) {
                let photo = {
                    id: null,
                    name: file.name,

                    is_primary: file.is_primary,
                    file: file,
                    percentage: 0,
                    inProgress: false,
                    error: null,
                }

                if (files.length >= MAX_FILES) {
                    console.log('too many files')
                    toast.error(lang('Too many files'), { position: 'bottom-left' })
                    return
                }

                if (files.find(_file => _file.name == photo.file['name'])) {
                    console.warn('Photo already added, skipping...')
                    toast.error(lang('Photo already added'), { position: 'bottom-left' })
                    return false
                }

                // create xhr request for the current file
                const xhr = new XMLHttpRequest()
                // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                const formData = new FormData()
                formData.append('p', photo.file)
                formData.append('_token', csrf_token)

                // Add the file to the files Array
                photo.xhr = xhr
                // Set the preview for the file
                photo.preview = URL.createObjectURL(file)

                xhr.upload.onprogress = (e) => {
                    photo.percentage = parseInt((e.loaded / e.total) * 100)
                    photo.inProgress = true
                    setFiles(prevFiles => [...prevFiles.map(p => p.name == photo.name ? photo : p)])
                }

                xhr.onreadystatechange = () => {
                    switch (xhr.status) {
                        case 0 :
                            break
                        case 200: {
                            if (xhr.response) {
                                let jsonParsed = JSON.parse(xhr.response)
                                photo.status = 1
                                photo.success = 1
                                photo.inProgress = false
                                photo.id = jsonParsed.photo || null
                            }

                            break
                        }

                        case 400:
                        case 500: {
                            try {
                                let jsonParsed = JSON.parse(xhr.response)
                                photo.status = -1
                                photo.success = 0
                                photo.inProgress = false
                                photo.error = Object.values(jsonParsed)
                            } catch (ex) {
                                console.error(ex)
                            }
                            break
                        }

                        default : {
                            photo.status = -1
                            photo.inProgress = false
                            photo.success = 0
                        }
                    }
                    setFiles(prevFiles => [...prevFiles.map(p => p.name == photo.name ? photo : p)])
                }

                setFiles(prevFiles => [...prevFiles.map(p => p.name == photo.name ? photo : p), photo])
                photo.xhr.open('POST', route('photos.upload'), true)
                photo.xhr.send(formData)
            }
        },
        onDragEnter: e => setDragenter(true),
        onDragLeave: e => setDragenter(false),
        onDrop: e => setDragenter(false) || setStepError(currentStep, []),
        onError: e => {
        },
        accept: { 'image/*': [] },

    })

    const thumbs = files.map(file => (
        <div className={'lg:w-1/4 md:w-1/3 sm:w-1/2 w-full p-2'} key={file.name}>
            <div className={'cursor-pointer shadow transition-all p-1 rounded border overflow-hidden bg-white dark:bg-neutral-900 relative group ' +
                (file.is_primary ? ' border-4 border-blue-500' : ' border-transparent ')}
                 onClick={() => !file.is_primary && setPrimary(file.name)}
                 tabIndex={1}>
                <img
                    className={'relative aspect-square rounded-sm w-full object-cover -indent-96 overflow-hidden'}
                    src={file.preview || file.path.square_sm}
                    alt={file.name}
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview)
                    }}
                />
                <div className={'absolute z-10 right-5 top-2'}>

                    <FontAwesomeIcon
                        className={'opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all p-4 px-5 text-xl rounded' +
                            ' bg-inherit text-inherit hover:bg-black hover:text-white hover:dark:bg-black cursor-pointer'}
                        onClick={() => removeFile(file.name)}
                        icon={faTrash}/>
                </div>


                <div className={'absolute left-0 top-0 w-full h-full flex items-center justify-center'}>
                    <div className={'p-5 text-center transition-all ' +
                        (file.error?.length ? '' : '')}>

                        <FontAwesomeIcon icon={file.inProgress ? faSpinner : (file.status === 1 ? faCheck : faMultiply)}
                                         spin={file.inProgress}
                                         onClick={() => file.status !== 1 ? removeFile(file.name) : {}}
                                         className={'text-2xl aspect-square text-white backdrop-blur-sm p-2 rounded-full ' +
                                             (file.status == 1 ? 'bg-lime-500/50' : 'bg-orange-700/50 cursor-pointer') +
                                             ''}/>

                        {file.error && file.error.length ? <span className={'absolute text-xs w-full left-0 bottom-0 p-2 bg-black/70'}>
              {file.error?.map(e => e ? e?.join('\n') : '')}
            </span> : <></>}
                        {file.inProgress ? <div className={'font-serif text-center text-2xl rounded shadow-sm mt-1'}>
                            {file.percentage}%
                        </div> : <></>}
                    </div>
                </div>
            </div>
        </div>
    ))

    return <>
        <section className={'container min-h-[350px] relative '}>
            <div {...getRootProps()}
                 ref={uploadRef}
                 className={'absolute inset-0 cursor-pointer group hover:text-lime-700 dark:hover:text-white  w-full flex items-center justify-center'}>
                <input {...getInputProps()}/>
                {!files.length ?
                    <>
                        <div className={'text-neutral-200 select-none transition-all dark:group-hover:text-white group-hover:text-lime-800 dark:text-neutral-600 relative'}>
                            {lang('Drag \'n\' drop some files here, or click to select files')}
                        </div>
                        <FontAwesomeIcon icon={faFileImage} className={'absolute text-8xl animate-tilt transition-all select-none z-0 ' +
                            (dragenter ? ' opacity-100 text-orange-500 ' : ' opacity-10 ')}/>
                    </> : <></>}
            </div>
            <div className={'-mx-4 flex flex-wrap items-stretch justify-center h-full'}>
                {thumbs}
            </div>
        </section>
    </>
}
