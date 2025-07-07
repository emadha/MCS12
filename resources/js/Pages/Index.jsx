import {usePage} from '@inertiajs/react'
import {useContext, useEffect, useState} from 'react'
import ListingContainer from '@/Components/Listing/ListingContainer'
import {AppContext} from '@/AppContext'
import {faPlugCirclePlus, faSpinner} from '@fortawesome/free-solid-svg-icons'
import ShopBlock from '@/Pages/Shops/Components/ShopBlock'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import HeroSection from "@/Components/HeroSection.jsx";

export default function Index({
                                  shops, latest_items = [], total = [],
                              }) {
    const {lang, setNavbarTransparent, formatNumbers} = useContext(AppContext)
    const {auth} = usePage().props
    const [show, setShow] = useState(true)
    const [loadingShowrooms, setLoadingShowrooms] = useState(true)
    const [showrooms, setShowrooms] = useState([])
    const [promotedShowrooms, setPromotedShowrooms] = useState([])
    const {api} = useContext(AppContext)

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
            document.getElementById('listingBlock')?.scrollIntoView({behavior: 'smooth'})
        }, 100)
    }

    const PageBlock = ({className, children}) => {
        return <div className={'container my-5 p-2' + (className ? ' ' + className : '')}>
            <div className={'bg-grad-primary backdrop-blur-xl shadow py-5 px-10 rounded'}>
                {children}
            </div>
        </div>
    }
    useEffect(() => {
        setLoadingShowrooms(true)
        api.get(route('api.showrooms')).then(res => {
            setShowrooms(res.data.showrooms)
            setPromotedShowrooms(res.data.promoted)
        }).finally(f => setLoadingShowrooms(false))
    }, [])

    return <>
        <div className={'transition-all h-full w-full relative'}>
            {show ? <div className={'z-10 '}>

                <HeroSection latestItems={latest_items.data ?? []}/>

                <div className={'my-5'}>
                    <div className={'relative z-[20] container mx-auto px-5 my-20 drop-shadow-xl'}>
                        {loadingShowrooms ?
                            <div className={'flex items-center min-h-52 justify-center select-none'}>
                                <FontAwesomeIcon size={'2xl'} icon={faSpinner} className={'mx-5'} spin={true}/> Getting
                                Showrooms...
                            </div>
                            : <>
                                <div className={'flex items-center justify-between'}>
                                    <h2 className={'select-none -mt-2'}>{lang('Showrooms')}</h2>
                                    {auth?.user && <SecondaryButton icon={faPlugCirclePlus}>Create Your Own
                                        Showroom</SecondaryButton>}
                                </div>

                                {
                                    promotedShowrooms.map(promotedShowroom => <ShopBlock shop={promotedShowroom}/>)
                                }

                                {
                                    showrooms.map(showroom => <div
                                        className={'w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 aspect-square'}>
                                        <ShopBlock shop={showroom}/>
                                    </div>)
                                }

                            </>}
                    </div>
                </div>
                <ListingContainer type={'cars'} hasSearch={true}/>
            </div> : <></>}

        </div>
    </>
}
