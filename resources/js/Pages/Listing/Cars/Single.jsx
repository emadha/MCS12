import SingleCarDetailBox from '@/Pages/Database/Cars/Components/SingleCarDetailBox'
import PhotoGallery from '@/Pages/Listing/Components/PhotoGallery'
import ShopBlock from '@/Pages/Listing/Components/ShopBlock'
import ListingBlockBase from '@/Pages/Listing/Components/ListingBlockBase'
import CarSpecifications from '@/Pages/Listing/Cars/Components/Single/CarSpecifications'
import ListingComments from '@/Pages/Listing/Cars/Components/Single/ListingComments'
import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '@/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faExclamationTriangle, faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import Alert from '@/Components/Alerts/Alert'
import RelatedItems from '@/Pages/Listing/Components/RelatedItems'
import QRCodeStyling from 'qr-code-styling'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { Link, usePage } from '@inertiajs/react'

export default function Single ({ item, can }) {

    const { darkMode } = useContext(AppContext)
    const { auth } = usePage().props

    const [qrCode, setQrCode] = useState(new QRCodeStyling({
        width: 1000,
        height: 1000,
        extension: 'png',
        backgroundOptions: {
            color: '#fff',
            round: .1,
        },
        margin: 40,

        dotsOptions: {
            color: '#4267b2',
        },
        imageOptions: {
            crossOrigin: 'anonymous',
        },
    }))

    const qrRef = useRef()

    const { lang, settings, setHasSidebar } = useContext(AppContext)

    useEffect(e => {
        setHasSidebar(false)

        qrCode.append(qrRef.current)
        qrCode.update({
            backgroundOptions: {
                round: .1,
                color: darkMode ? '#232323' : '#fff',
            },
            dotsOptions: {
                type: 'rounded',
                color: darkMode ? '#c0c0c0' : '#293e56',
            },
            cornersDotOptions: {
                color: darkMode ? '#4f6cb4' : '#255f9d',
            },
            cornersSquareOptions: {
                color: darkMode ? '#e3e3e3' : '#05427e',
            },
            data: item.data.permalink ?? 'https://mecarshop.com',
        })

    }, [])

    return item.data?.item ? <div className={'mt-20'}>
        <div className={'relative'}>
            <div className={'xl:backdrop-blur-xl container px-5'}>
                {!item.data.is_approved ? <Alert className={'my-10 animate-pop-in-lg'} type={'warning'}>{lang('Item is not yet approved.')}</Alert> : <></>}
                <div className={''}>{item.data.photos
                    ? <PhotoGallery className={'dark:mb-10 dark:mt-5 mb-7 duration-1000'} photos={item.data.photos}/>
                    : console.error('Item photos not set.')
                }</div>
            </div>
        </div>

        <div className={'mx-auto dark:bg-neutral-800'}>
            <div className={'container flex flex-wrap items-flex-wrap'}>
                <div className={'lg:w-8/12 w-full'}>
                    <div className={'bg-white py-10 h-full dark:bg-neutral-800 shadow-sm md:rounded-xl px-5 dark:text-white overflow-hidden relative '
                        + 'whitespace-pre-wrap'}>

                        {auth?.user?.id === item.data.user?.id
                            ? <div className={'flex flex-wrap gap-x-1 p-5 bg-slate-100 rounded shadow'}>
                                <div className={'w-full select-none mb-5'}>
                                    <h2 className={'w-full m-0'}>Manage this item</h2>
                                    <small>You are authorized to manage this item, and to view its stats.</small>
                                </div>
                                <Link href={route('listing.single.edit', { listingItem: item.data.id })}>
                                    <SecondaryButton>{lang('Manage')}</SecondaryButton>
                                </Link>

                                <Link href={route('listing.single.edit', { listingItem: item.data.id })}>
                                    <SecondaryButton>{lang('Delete')}</SecondaryButton>
                                </Link>

                                <Link href={route('listing.single.edit', { listingItem: item.data.id })}>
                                    <SecondaryButton>{lang('Mark as sold')}</SecondaryButton>
                                </Link>

                                <Link href={route('listing.single.edit', { listingItem: item.data.id })}>
                                    <SecondaryButton>{lang('View stats')}</SecondaryButton>
                                </Link>

                            </div>
                            : <></>}


                        <h3 className={'my-0 mb-3 select-none'}>{lang('Description')}</h3>
                        {item.data.description
                            ? <div className={''}>
                                <p className={''}>{item.data.description}</p>
                            </div>
                            : console.error('Item description not set.')
                        }

                        {item.data.shop
                            ? <ShopBlock className={'pt-0'} shop={item.data.shop}/>
                            : <></>}
                    </div>
                </div>
                <div className={'lg:w-4/12 w-full sm:px-5 text-sm'}>
                    <div className={''}>
                        <p className={'w-full text-xs select-none'}>Click on the button to reveal the contact methods.</p>
                        {item.data.price ?
                            <PrimaryButton
                                className={'!text-4xl font-black rounded bg-lime-600 m-0 p-0 inline-block px-5 py-3 text-white w-full !text-center'}
                                icon={faMoneyBill}
                            >
                                {item.data.price}
                            </PrimaryButton>
                            : console.error('Item price not set.')}
                    </div>

                    <div className={'flex flex-wrap gap-x-10 items-center justify-between'}>
                        <CarSpecifications specifications={item.data.specifications}/>
                        <div className={'md:w-full md:px-5 w-2/4'}>
                            <h3 className={'select-none text-center'}>Permalink</h3>
                            <Link href={item.data.permalink} className={'text-xs opacity-50 hover:opacity-100'} target={'_blank'}>{item.data.permalink}</Link>
                            <div ref={qrRef} className={'drop-shadow my-3 qrc aspect-square overflow-hidden'}/>
                            <SecondaryButton icon={faDownload}
                                             className={'mx-auto'}
                                             onClick={() => qrCode.download({
                                                 name: item.data.title + ' Link QR Code',
                                             })}
                            >Download Code</SecondaryButton>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <ListingBlockBase className={'container sm:px-5 px-3'}>
            <RelatedItems item={item.data}/>
        </ListingBlockBase>

        {settings?.comments?.enabled ? <div className={'bg-neutral-50 dark:bg-neutral-900'}>
            <div className={'container px-5'}>
                <ListingComments comments={item.data.comments}/>
            </div>
        </div> : <></>}

        {item.data.item.car ?
            <div className={'bg-white dark:bg-transparent'}>
                <div className={'container'}>
                    <ListingBlockBase className={'px-5'}>
                        <SingleCarDetailBox car={item.data.item.car}/>
                    </ListingBlockBase>
                </div>
            </div>
            : console.error('Item Car not set.')
        }


    </div> : <div className={'container max-w-sm shadow-xl text-center text-neutral-600 rounded-xl my-10 p-10 bg-neutral-800'}>
        <FontAwesomeIcon icon={faExclamationTriangle} className={'mx-2'}/>
        Invalid item
    </div>
}
