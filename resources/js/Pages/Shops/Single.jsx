import ShopBadges from '@/Pages/Shops/Components/ShopBadges';
import ListingItemCarBlock from '@/Components/Listing/ListingItemCarBlock';
import Field from '@/Components/Form/Field';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faCircleQuestion,
    faExclamationTriangle,
    faGlobe,
    faPhone,
    faShop,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import LikeButton from '@/Components/Actions/LikeButton';
import Alert from '@/Components/Alerts/Alert';
import {Link, router, usePage} from '@inertiajs/react';
import ContextMenu from '@/Components/ContextMenu';
import ConfirmForm from '@/Components/Forms/ConfirmForm';
import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '@/AppContext';
import ReportForm from '@/Components/Forms/ReportForm';
import {
    faFacebook,
    faInstagram,
    faTiktok,
    faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import {faCalendar, faEnvelope} from '@fortawesome/free-regular-svg-icons';
import Hr from '@/Components/Hr';
import {Inertia} from '@inertiajs/inertia';
import SkeletonListingBlockItem from '@/Components/SkeletonListingBlockItem';
import {createTheme} from '@mui/material/styles';
import {lime, red} from '@mui/material/colors';
import ShopLayout from '@/Layouts/ShopLayout.jsx';
import LeafletMapComponent from '@/Components/LeafletMapComponent.jsx';
import ReviewComponent from '@/Components/Actions/Reviews/ReviewComponent.jsx';

export default function Single({
    title,
    shop,
    unique_makes = [],
    unique_models = [],
}) {
    const urlParams = new URLSearchParams(window.location.search);
    const {lang, setModalData, setModalShow} = useContext(AppContext);
    const [loadedShop, setLoadedShop] = useState(shop.data);
    const [loadingShopListings, setLoadingShopListings] = useState(true);
    const [shopListings, setShopListings] = useState([]);
    const [shopListingsMeta, setShopListingsMeta] = useState([]);
    const [shopListingMakes, setShopListingMakes] = useState(unique_makes);
    const [shopListingModels, setShopListingModels] = useState(unique_models);
    const [selectedShopListingMakes, setSelectedShopListingMakes] = useState(
        []);
    const [selectedShopListingModels, setSelectedShopListingModels] = useState(
        []);
    const [shopListingPage, setShopListingPage] = useState(
        urlParams.get('page'));

    const [statsVisits, setStatsVisits] = useState([]);
    const {user} = usePage().props.auth;

    const updateShop = (updatedItem) => {
        setLoadedShop(updatedItem);
    };

    const fetchListing = (type = 'cars') => {
        setLoadingShopListings(true);
        axios.get(route('api.shop.listings', {
            shop: loadedShop.id,
            t: 'cars',
            make: selectedShopListingMakes,
            model: selectedShopListingModels,
            page: !selectedShopListingMakes.length ||
            !selectedShopListingModels.length ? 0 : shopListingPage,
        })).then(
            r => {
                setShopListings(r.data.data);
                setShopListingsMeta(r.data);
            },
        ).finally(() => setLoadingShopListings(false));
    };

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }, 100);
    }, []);

    useEffect(() => {
        fetchListing();

        // Get shop stats
        axios.get(route('shop.stats.visits.graph', {shop: loadedShop.id})).
            then(r => setStatsVisits(r.data?.data));
    }, [selectedShopListingMakes, selectedShopListingModels]);

    const contextOnClick = (action) => {
        switch (action) {
            case 'delete': {
                setModalData({
                    content: <ConfirmForm
                        onSuccess={() => removeListingItem(item.id)}
                        action={'delete'}
                        item={loadedShop}/>,
                });
                setModalShow(true);
                break;
            }
            case 'edit': {
                router.visit(route('shop.single.edit', loadedShop.id));
                break;
            }
            case 'disapprove':
            case 'approve': {
                setModalData({
                    content: <ConfirmForm onSuccess={updateShop} action={action}
                                          item={loadedShop}/>,
                });
                setModalShow(true);
                break;
            }
            case 'list_item': {
                Inertia.visit(
                    route('listing.car.submit', {shop: loadedShop.id}),
                );
                break;
            }
            case 'report': {
                setModalShow(true);

                setModalData({
                    title: lang('Report'),
                    content: <ReportForm h={loadedShop.h}/>,
                });
                break;
            }

            default:
                console.log('Unknown context action:' + action);
        }
    };

    const contactIcons = {
        'FACEBOOK': faFacebook,
        'EMAIL': faEnvelope,
        'PHONE': faPhone,
        'WHATSAPP': faWhatsapp,
        'INSTAGRAM': faInstagram,
        'TIKTOK': faTiktok,
        'WEBSITE': faGlobe,
        'OTHER': faCircleQuestion,
    };

    const contactLabel = {
        'FACEBOOK': 'Facebook',
        'EMAIL': 'E-mail',
        'PHONE': 'Phone',
        'WHATSAPP': 'Whatsapp',
        'INSTAGRAM': 'Instagram',
        'TIKTOK': 'TikTok',
        'WEBSITE': 'Website',
        'OTHER': 'Other',
    };

    const ContactsBlock = ({contacts = []}) => <>
        {
            contacts.map((contact, i) => <div key={i}
                                              className={'flex mx-1 text-sm my-1'}>
                <span
                    className={'flex items-center text-xs text-neutral-400 w-1/12'}>
                    <FontAwesomeIcon className={'text-xs'}
                                     icon={contactIcons[contact.method]}/>
                </span>
                <strong dir={'ltr'}>{contact.value}</strong>
            </div>)
        }</>;

    const LocationBlock = ({location}) =>
        <div>
            <p>Longitutde: {location.long}</p>
            <p>Latitude: {location.lat}</p>

            <p>{location.address}</p>
            <LeafletMapComponent initialLocation={location}/>
        </div>;
    const pluck = (arr, keys) => arr.map(
        i => Object.values(keys).map(k => i[k]));
    const theme = createTheme({
        palette: {
            primary: red,
            secondary: lime,
        },
    });
    return <ShopLayout shop={shop}>
        {shop ? <>
            <div className={'relative'}>
                {!loadedShop?.is_approved &&
                    <Alert className={'my-5'} type={'danger'}>
                        <p>Shop is currently under review and is not active.</p>
                        <small>Inactive shop will not be displayed to the
                            public, you are the only one who can see this
                            page.</small>
                    </Alert>}
                <div className={'w-full relative'}>
                    <div className={'absolute w-full h-full aspect-video'}>
                        <img src={'https://picsum.photos/1200'}
                             className={'w-full h-full object-cover'}/>
                    </div>
                    <div className={'flex items-stretch relative'}>

                        <div
                            className={'w-1/4 flex items-center justify-center drop-shadow aspect-square'}>
                            {loadedShop &&
                            loadedShop?.photos[0]?.path?.square_sm
                                ? <img
                                    className={'outline outline-transparent hover:drop-shadow-xl transition-all cursor-pointer hover:outline-white outline-offset-4 ring-offset-transparent w-1/2 rounded-xl'}
                                    src={loadedShop?.photos[0]?.path?.square_sm}
                                    alt="Primary Photo"/>
                                : <FontAwesomeIcon icon={faShop}
                                                   className={'text-8xl opacity-70'}/>
                            }
                        </div>

                        <div className={'w-3/4 p-5 rounded'}>
                            <div
                                className={'flex h-full font-thin items-center gap-x-5'}>
                                <div>
                                    <h1 className={'text-3xl drop-shadow-lg'}>{loadedShop.title}</h1>
                                    <p>{loadedShop.description}</p>
                                </div>
                            </div>
                        </div>
                        <ContextMenu
                            className={'absolute right-5 top-5'}
                            h={loadedShop.h}
                            onClick={contextOnClick}/>
                    </div>
                </div>

            </div>

            <div className={'flex flex-wrap items-start justify-center mt-10'}>

                <div className={'w-full lg:w-1/4 flex flex-wrap @container'}>
                    <Field title={lang('Details')} collapsable={true}
                           className={'w-full rounded-lg p-2 bg-white/5'}>

                        <div className={'flex space-x-2 items-center p-2'}
                             title={lang('Created at')}>
                            <FontAwesomeIcon icon={faCalendar}
                                             className={'text-xs dark:text-neutral-500'}
                            />
                            <small>{loadedShop.created_at}</small>
                        </div>

                        <div
                            className={'flex space-x-2 items-center p-2 select-none dark:text-neutral-500'}
                            title={lang('Created by')}>
                            <FontAwesomeIcon icon={faUser}
                                             className={'text-xs dark:text-neutral-500'}>Created</FontAwesomeIcon>
                            <small>{loadedShop.user.name}</small>
                        </div>

                        <div
                            className={'flex space-x-2 items-center p-2 select-none dark:text-neutral-500'}
                            title={lang('View Stats')}>
                            <FontAwesomeIcon icon={faUser}
                                             className={'text-xs dark:text-neutral-500'}/>
                            <Link href={route('shop.single.stats',
                                loadedShop.id)}><small>View stats</small></Link>
                        </div>
                    </Field>
                    <Field title={lang('Description')} collapsable={true}
                           className={'w-full rounded-lg p-2 bg-white/5'}>
                        <p className={'text-sm text-left'}>{loadedShop.description}</p>
                    </Field>

                    <div
                        className={'flex items-center justify-center w-full py-10'}>
                        <LikeButton _r={'loadedShop.single.favorite'}
                                    item={loadedShop}
                                    iconClassName={'text-3xl'}/>
                    </div>

                    <Field title={lang('Shop type')}
                           className={'w-full rounded-lg p-2 bg-white/5'}>
                        <ShopBadges className={'flex flex-wrap'}
                                    shop={loadedShop}/>
                    </Field>
                    <Hr/>

                    <Field title={lang('Contact')}
                           className={'w-full p-2 bg-white/5 rounded-lg'}>
                        <ContactsBlock contacts={loadedShop.contacts}/>
                    </Field>

                    <Field title={lang('Reviews')} collapsable={true}>
                        <ReviewComponent h={loadedShop.h}/>
                    </Field>
                    <Hr className={'hidden lg:block'}/>
                </div>

                <Field className={'w-3/4'}>
                    <div className={'p-5 pt-0 space-y-5'}>
                        <div className={'flex items-center select-none'}>
                            <span className={'text-xs text-neutral-500'}>Available
                                Car Makes</span>
                            <div className={'flex items-center flex-wrap'}>
                                {Object.keys(shopListingMakes).
                                    map((m, i) => <span
                                            key={i}
                                            onClick={(e) => {
                                                setSelectedShopListingMakes([m]);
                                                setSelectedShopListingModels([]);
                                                if (selectedShopListingMakes.includes(
                                                    m)) {
                                                    setSelectedShopListingMakes([]);
                                                }
                                            }}
                                            className={'px-1 underline text-sm cursor-pointer hover:font-bold ' +
                                                (selectedShopListingMakes.includes(
                                                    m) ? ' font-extrabold ' : '')
                                            }>
                                            {unique_makes[m]}
                                        </span>,
                                    )}</div>
                        </div>

                        <div className={'flex items-center select-none'}>
                            <span className={'text-xs text-neutral-500'}>Available
                                Car Models</span>
                            <div className={'flex items-center flex-wrap'}>
                                {Object.keys(shopListingModels).
                                    map((m, i) => <span
                                            key={i}
                                            onClick={(e) => {
                                                setSelectedShopListingModels([m]);
                                                setSelectedShopListingMakes([]);
                                                if (selectedShopListingModels.includes(
                                                    m)) {
                                                    setSelectedShopListingModels(
                                                        []);
                                                }
                                            }}
                                            className={'px-1 underline text-sm cursor-pointer hover:font-bold ' +
                                                (selectedShopListingModels.includes(
                                                    m) ? ' font-extrabold ' : '')
                                            }>
                                            {unique_models[m]}
                                        </span>,
                                    )}
                            </div>
                        </div>
                    </div>

                    {loadingShopListings
                        ? <div
                            className={'py-10 flex items-center justify-center'}>
                            <div
                                className={'flex space-x-5 items-center w-full'}>
                                <div className={'flex flex-wrap w-full'}>
                                    <SkeletonListingBlockItem num={3}/>
                                </div>
                            </div>
                        </div>
                        : shopListings?.length ? <div
                            className={'flex flex-wrap mt-10'}>

                            {shopListings.map((item, i) => <div
                                className={'flex flex-wrap w-full'} key={i}>
                                <ListingItemCarBlock k={item.h}
                                                     itemsView={'list'}
                                                     item={item}
                                                     className={'h-full'}/>
                            </div>)}

                            {shopListingsMeta.meta === undefined ||
                            shopListingsMeta.meta?.links?.length === 3 // 3 because prev current next (so no more pages)
                                ? <p
                                    className={'text-center text-xs w-full select-none mt-10 opacity-50'}>That
                                    is
                                    all.</p>
                                : <div
                                    className={'flex flex-wrap justify-center items-center w-full gap-x-5'}>
                                    {Object.values(
                                        shopListingsMeta.meta?.links).
                                        map((meta, i) =>
                                            <div key={i}>
                                                <Link
                                                    preserveScroll={true}
                                                    dangerouslySetInnerHTML={{__html: meta.label}}
                                                    href={meta.url}
                                                />
                                            </div>)
                                    }</div>
                            }
                        </div> : <p
                            className={'text-xs block text-center select-none'}>Nothing
                            found</p>
                    }
                </Field>
            </div>

        </> : <>
            <div
                className={'flex items-center gap-x-2 justify-center select-none text-center'}>
                <FontAwesomeIcon icon={faExclamationTriangle}/>
            </div>
        </>}
    </ShopLayout>;
}
