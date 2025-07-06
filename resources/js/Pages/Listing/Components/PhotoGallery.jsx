import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import ContextMenu from '@/Components/ContextMenu'
import ConfirmForm from '@/Components/Forms/ConfirmForm'
import { AppContext } from '@/AppContext'
import ReportForm from '@/Components/Forms/ReportForm'
import { Transition } from '@headlessui/react'

export default function PhotoGallery ({ className, photos }) {
    const [loadedPhotos, setLoadedPhotos] = useState(photos)
    const { setModalShow, setModalData, lang } = useContext(AppContext)
    const [primaryPhoto, setPrimaryPhoto] = useState(0)
    const [thumbnails, setThumbnails] = useState([])
    const [selected, setSelected] = useState(photos.indexOf(photos.filter(photo => photo.is_primary)[0]) > 0 ? photos.indexOf(photos.filter(photo => photo.is_primary)[0]) : 0)
    const [isLoading, setIsLoading] = useState(0)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        setPrimaryPhoto(() => {
            return selected
        })
        return () => {
            setIsLoading(0)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [selected])

    function handleKeyDown (k) {
        switch (k.key) {
            case 'ArrowLeft': {
                prevPhoto()
                break
            }
            case 'ArrowRight': {
                nextPhoto()
                break
            }
        }
    }

    const selectPhoto = (photo) => {
        setIsLoading(1)
        setSelected(prev => {
            setIsLoading(0)
            return loadedPhotos.indexOf(photo)
        })
    }

    const nextPhoto = () => {
        setSelected(prev => selected + 1 >= loadedPhotos.length ? 0 : selected + 1)
    }

    const prevPhoto = () => {
        setSelected(prev => selected - 1 < 0 ? loadedPhotos.length - 1 : selected - 1)
    }

    const onDrag = (e) => {

    }
    const updatePhotoBlock = (photo) => {
        setLoadedPhotos(prevState => [...prevState.map(p => p.h === photo.h ? photo : p)])
    }

    const handleContextMenu = (action) => {
        switch (action) {
            case 'make_primary': {
                setModalData({
                    content: <ConfirmForm action={action}
                                          item={loadedPhotos[selected]}/>,
                })
                setModalShow(true)
                break
            }
            case 'delete': {
                setModalData({
                    content: <ConfirmForm
                        onSuccess={(updatedPhoto) => {setLoadedPhotos(loadedPhotos.filter(p => p.name !== loadedPhotos[primaryPhoto].name))}}
                        action={'delete'}
                        item={loadedPhotos[0]}/>,
                })
                setModalShow(true)
                break
            }
            case 'publish':
            case 'unpublish': {
                setModalData({
                    content: <ConfirmForm
                        onSuccess={(updatedPhoto) => {setLoadedPhotos(loadedPhotos.map(p => p.name === updatedPhoto.name ? updatedPhoto : p))}}
                        action={loadedPhotos[primaryPhoto].published ? 'unpublish' : 'publish'}
                        item={loadedPhotos[0]}/>,
                })
                setModalShow(true)
                break
            }
            case 'report': {
                setModalShow(true)

                setModalData({
                    title: lang('Report'), content: <ReportForm
                        h={loadedPhotos[primaryPhoto].h ?? loadedPhotos[selected]}/>,
                })
                break
            }
        }
    }

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) {
            return
        }
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) {
            nextPhoto()
        }

        if (isRightSwipe) {
            prevPhoto()
        }

    }

    return <>
        {loadedPhotos.length ? <div className={'w-full flex flex-wrap justify-stretch items-stretch' + (className ? ' ' + className : '')}>
            <div
                className={'xl:w-8/12 w-full items-center rtl:mr-0 flex justify-center rounded-lg cursor-pointer relative group xl:mb-0'}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

                <Transition show={!loadedPhotos[selected]?.published ?? false}
                            enter={'duration-300'}
                            enterFrom={'opacity-0'}
                            enterTo={'opacity-100'}
                            leave={'duration-1000'}
                            leaveFrom={'opacity-100'}
                            leaveTo={'opacity-0'}>
                    <div className={'absolute rtl:left-5 right-5 bottom-5 p-5 rounded-xl bg-black'}>
                        <small><FontAwesomeIcon className={'mx-1'} icon={faExclamationTriangle}/>This photo is not published</small>
                        <p>{lang('Unpublished photos will only be displayed to you.')}</p>
                    </div>
                </Transition>

                <span
                    className={'absolute left-0 text-5xl hover:bg-black/10 bottom-0 h-full flex items-end justify-start p-10 font-black ' +
                        'opacity-10 transition-all group-hover:opacity-50 z-10 ' + ' hover:opacity-100 drop-shadow hover:text-white mix-blend-difference w-1/2 h-12 text-center '}
                    onClick={e => prevPhoto()}>
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </span>


                <div
                    className={'w-full select-none aspect-video flex items-center content-center justify-center relative '}>
                    <div className={'absolute z-[1000] right-10 top-5'}>
                        <ContextMenu
                            h={loadedPhotos[selected]?.h}
                            className={'text-4xl'}
                            menuClassName={'aspect-square w-14 drop-shadow'}
                            onClick={handleContextMenu}/>
                    </div>
                    <FontAwesomeIcon className={'absolute text-4xl ' + (isLoading ? ' block ' : ' hidden')} icon={faSpinner} spin/>
                    {isLoading ? <></> : <img
                        className={'rounded-md selected-none w-full aspect-video object-cover transition-all h-full ' +
                            (loadedPhotos[primaryPhoto]?.published ? ' opacity-100 ' : ' opacity-30 ')}
                        onDrag={onDrag}
                        onLoad={e => setIsLoading(0)}
                        src={loadedPhotos[primaryPhoto]?.path?.wide_hi ?? loadedPhotos[selected]?.path?.wide_hi ?? loadedPhotos[0]?.path.wide_hi}/>}
                </div>

                <span
                    className={'absolute right-0 text-5xl h-full hover:bg-black/10 flex items-end justify-end p-10 font-black opacity-10 ' + 'transition-all group-hover:opacity-50 z-10 ' +
                        ' hover:opacity-100 drop-shadow hover:text-white mix-blend-difference w-1/2 h-12 text-center '}
                    onClick={e => nextPhoto()}>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </span>
            </div>
            <div
                className={'xl:w-4/12 select-none w-full flex flex-wrap content-start justify-start'}>
                {loadedPhotos.map((photo, k) =>
                    <div key={k}
                         className={'xl:w-1/3 max-h-32 sm:w-2/12 w-1/6 p-1 aspect-square'}>
                        <img
                            className={'transition-all rounded cursor-pointer w-full h-full object-cover ' + (selected === k ? ' ring-2 ring-orange-300' : ' ') +
                                (photo.published ? '  ' : ' opacity-20 ')}
                            key={photo.id}
                            onClick={(e) => selectPhoto(photo)}
                            src={photo.path.square_sm}
                            alt={''}
                        />
                    </div>)}
            </div>

        </div> : <div className={'text-center py-64 select-none dark:text-neutral-600'}>No Photos</div>}
    </>
}
