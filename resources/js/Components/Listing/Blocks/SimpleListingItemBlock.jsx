import React, {useState} from 'react'
import {Link} from '@inertiajs/react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronLeft, faChevronRight, faCubes} from '@fortawesome/free-solid-svg-icons'

export default function SimpleListingItemBlock({className, item = {}}) {

    const [photos, setPhotos] = useState(item.photos?.map(p => {
        p.top = p.is_primary ? true : false
        return p
    }) ?? [])

    const [selectedPhoto, setSelectedPhoto] = useState(photos.filter(p => p.is_primary)[0] ?? null)

    const nextPhoto = (e) => {
        e.stopPropagation()
        e.preventDefault()

    }

    const previousPhoto = (e) => {
        e.stopPropagation()
        e.preventDefault()

        console.log(photos)

    }

    const setOnTop = (photo) => {
        setPhotos(() => photos.map(p => {
            console.clear()
            p === photo ? photos[photos.indexOf(photo) + 1].top = 1 : p
            return p
        }))
    }

    const PhotosCountBullets = () => {
        let bullets = []

        for (let i in photos) {
            bullets.push(
                <span key={i} className={'inline-block w-10 h-0.5 bg-white rounded-sm ' +
                    (photos[i].top ? ' opacity-100 ' : ' opacity-30 ')}/>,
            )
        }

        return <div className={'flex flex-nowrap gap-x-0.5 py-2'}>
            {bullets}
        </div>
    }

    return <>
        <Link className={'cursor-pointer hover:outline-offset-2 hover:outline-1 transition-all ' +
            'outline-transparent outline-1 hover:outline-yellow-500 outline aspect-square ' +
            'bg-white/10 dark:bg-transparent overflow-hidden group z-0 block p-0.5 rounded hover:rounded-sm shadow-xl hover:shadow-2xl h-auto relative'}
              href={item.link}>


            <div className={'relative whitespace-norwrap overflow-hidden h-full w-full'}>
                {item.photos?.map((photo, i) =>
                    photo.path?.square_md
                        ? <img key={i} className={'absolute w-full group-hover:-top-5 duration-500 object-cover top-0 left-0'}
                               src={photo.path?.square_md} alt={photo.path?.square_md ?? item.title}/>
                        : <div key={i} className={'w-full flex items-center justify-center h-full select-none opacity-10'}>
                            <FontAwesomeIcon icon={faCubes}/>
                        </div>)
                }
            </div>
            <div
                className={'opacity-0 group-hover:opacity-100 delay-75 duration-500 absolute -bottom-5 group-hover:-bottom-1 transition-all z-10 w-full px-2 pr-3'}>
                <PhotosCountBullets/>
            </div>

            <div
                className="absolute bottom-32 top-[38%] xl:top-[42%] -mb-1 w-full text-black z-10 group/itemBlock flex justify-between px-2">
                <FontAwesomeIcon icon={faChevronLeft}
                                 onClick={previousPhoto}
                                 title={'Previous Photo'}
                                 className={'group-hover:opacity-90 hover:!opacity-100 hover:scale-110 hover:shadow-md p-2 opacity-20 transition-all rounded-full bg-white aspect-square'}/>
                <FontAwesomeIcon icon={faChevronRight}
                                 onClick={nextPhoto}
                                 title={'Next Photo'}
                                 className={'group-hover:opacity-90 hover:!opacity-100 hover:scale-110 hover:shadow-md p-2 opacity-20 transition-all rounded-full bg-white aspect-square'}/>
            </div>
            <span title={item.title}
                  className={'dark:bg-neutral-900 dark:text-white bg-white absolute text-black p-2 text-xs max-h-16 overflow-ellipsis w-full truncate group-hover:bottom-0 -bottom-20 duration-300'}>
                {item.title}
            </span>
        </Link>
    </>
}
