import {usePage} from '@inertiajs/react';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '@/AppContext';
import HeroSection from '@/Components/HeroSection.jsx';
import ShowRoomSection from '@/Components/ShowRoomSection.jsx';
import ListingContainer from '@/Components/Listing/ListingContainer.jsx';
import Hr from '@/Components/Hr.jsx';

export default function Index({
    shops, latest_items = [], total = [],
}) {
    const {lang, setNavbarTransparent, formatNumbers} = useContext(AppContext);
    const {auth} = usePage().props;
    const [show, setShow] = useState(true);
    const [loadingShowrooms, setLoadingShowrooms] = useState(true);
    const [showrooms, setShowrooms] = useState([]);
    const [promotedShowrooms, setPromotedShowrooms] = useState([]);
    const {api} = useContext(AppContext);

    useEffect(e => {
        const urlSearchParams = new URLSearchParams(location.search);

        setShow(true);

        if (
            urlSearchParams.has('o') ||
            urlSearchParams.has('ec') ||
            urlSearchParams.has('c')
        ) {
            goToListingContainer();
        }

    }, []);

    const goToListingContainer = () => {
        setTimeout(() => {
            document.getElementById('listingBlock')?.scrollIntoView({behavior: 'smooth'});
        }, 100);
    };

    const PageBlock = ({className, children}) => {
        return <div className={'container my-5 p-2' + (className ? ' ' + className : '')}>
            <div className={'bg-grad-primary backdrop-blur-xl shadow py-5 px-10 rounded'}>
                {children}
            </div>
        </div>;
    };
    useEffect(() => {
        setLoadingShowrooms(true);
        api.get(route('api.showrooms')).then(res => {
            setShowrooms(res.data.showrooms);
            setPromotedShowrooms(res.data.promoted);
        }).finally(f => setLoadingShowrooms(false));
    }, []);

    return <>
        <div className={'transition-all h-full w-full relative'}>
            {show ? <div className={'z-10 '}>

                <HeroSection
                    latestItems={latest_items.data ?? []}/>

                <ShowRoomSection
                    showrooms={showrooms}
                    promotedShowrooms={promotedShowrooms}
                    loadingShowrooms={loadingShowrooms}/>

                <ListingContainer
                    type={'cars'}
                    hasSearch={true}/>

            </div> : <></>}

        </div>
    </>;
}
