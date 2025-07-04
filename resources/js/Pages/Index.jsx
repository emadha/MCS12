import { Link, usePage } from '@inertiajs/react'
import { useContext, useEffect, useRef, useState } from 'react'
import ListingContainer from '@/Components/Listing/ListingContainer'
import { AppContext } from '@/AppContext'
import { faPlugCirclePlus, faSpinner, faUpload } from '@fortawesome/free-solid-svg-icons'
import ShopBlock from '@/Pages/Shops/Components/ShopBlock'
import FlipWords from '@/Components/UI/flipwords'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SimpleListingItemBlock from '@/Components/Listing/Blocks/SimpleListingItemBlock'

export default function Index ({
    shops, latest_items = [], total = [],
}) {
    const { lang, setNavbarTransparent, formatNumbers } = useContext(AppContext)
    const { auth } = usePage().props
    const [show, setShow] = useState(true)
    const [loadingShowrooms, setLoadingShowrooms] = useState(true)
    const [showrooms, setShowrooms] = useState([])
    const [promotedShowrooms, setPromotedShowrooms] = useState([])

    useEffect(e => {
        const urlSearchParams = new URLSearchParams(location.search)

        setShow(true)

        if (
            urlSearchParams.has('o') ||
            urlSearchParams.has('ec') ||
            urlSearchParams.has('c')
        ) {
            goToListingContainer()
        }

    }, [])

    const goToListingContainer = () => {
        setTimeout(() => {
            document.getElementById('listingBlock')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const PageBlock = ({ className, children }) => {
        return <div className={'container my-5 p-2' + (className ? ' ' + className : '')}>
            <div className={'bg-grad-primary backdrop-blur-xl shadow py-5 px-10 rounded'}>
                {children}
            </div>
        </div>
    }
    useEffect(() => {
        setLoadingShowrooms(true)
        axios.post(route('api.showrooms')).then(res => {
            setShowrooms(res.data.showrooms)
            setPromotedShowrooms(res.data.promoted)
        }).finally(f => setLoadingShowrooms(false))
    }, [])

    return <>
        <div className={'transition-all h-full w-full relative'}>
            {show ? <div className={'z-10 '}>
                <div className={'bg-slate-500/10 px-5'}>
                    <div className={'container flex flex-wrap mx-auto justify-end items-center min-h-[70vh]'}>

                        <h1 className={'z-10 select-none text-center px-3 md:text-8xl rtl:text-7xl md:rtl:text-8xl lg:rtl:text-9xl text-5xl w-full mix-blend-overlay mt-36 max-w-screen drop-shadow-xl overflow-hidden'}>
                            <FlipWords beforeText={lang('Mecarshop')} className={'text-white absolute flex justify-center w-full'} words={[
                                lang('Marketplace'),
                                lang('Showrooms'),
                                lang('Rental'),
                                lang('Tuning'),
                                lang('Accessories'),
                                lang('Detailing'),
                                lang('Parts'),
                                lang('Paint'),
                                lang('Service'),
                                lang('Information'),
                            ]}/>
                            <small className={'-mt-24 md:-mt-3 text-sm rtl:text-center mb-5 md:rtl:-mt-24 lg:rtl:-mt-1 rtl:-mt-32 px-1 w-full block font-thin'}>
                                {lang('SLOGAN_SUB_SUB')}
                            </small>
                        </h1>
                        <div className={'z-10 flex flex-wrap items-center mx-auto mt-5 justify-center w-full'}>
                            {latest_items.data?.map(latest_item =>
                                <div className={'w-1/2 md:w-1/5 p-2'}
                                     key={'_latest' + latest_item.title}>
                                    <SimpleListingItemBlock item={latest_item}/>
                                </div>,
                            )}
                        </div>
                        <div className={'w-full flex justify-center my-16 py-10 z-10'}>
                            <Link className={'w-full md:w-1/3 max-w-screen'}
                                  href={route('listing.car.submit')}>
                                <SecondaryButton
                                    className={'animate-pop-in py-5 !text-xl transition-all rounded-md hover:rounded-xl shadow-lg hover:shadow-xl !px-10 w-full !bg-yellow-600 hover:!bg-orange-500 text-white dark:hover:text-slate-600 !text-center'}
                                    icon={faUpload}>
                                    {lang('List your Car')}
                                </SecondaryButton>
                            </Link></div>
                    </div>

                </div>

                <div className={'my-5'}>
                    <div className={'relative z-[20] container mx-auto px-5 my-20 drop-shadow-xl'}>
                        {loadingShowrooms ?
                            <div className={'flex items-center min-h-52 justify-center select-none'}>
                                <FontAwesomeIcon size={'2xl'} icon={faSpinner} className={'mx-5'} spin={true}/> Getting Showrooms...
                            </div>
                            : <>
                                <div className={'flex items-center justify-between'}>
                                    <h2 className={'select-none -mt-2'}>{lang('Showrooms')}</h2>
                                    {auth?.user && <SecondaryButton icon={faPlugCirclePlus}>Create Your Own Showroom</SecondaryButton>}
                                </div>

                                {
                                    promotedShowrooms.map(promotedShowroom => <ShopBlock shop={promotedShowroom}/>)
                                }

                                {
                                    showrooms.map(showroom => <div className={'w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 aspect-square'}>
                                        <ShopBlock shop={showroom}/>
                                    </div>)
                                }

                            </>}
                    </div>
                </div>
                <ListingContainer type={'cars'} hasSearch={true}/>
            </div> :<></>}

        </div>
    </>
}
