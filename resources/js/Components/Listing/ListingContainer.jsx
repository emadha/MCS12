import {useContext, useEffect, useState} from 'react'
import ListingItemCarBlock from '@/Components/Listing/ListingItemCarBlock'
import {Skeleton} from 'antd'
import {AppContext} from '@/AppContext'
import {ListingContext} from '@/Context/ListingContext'
import CarSearch from '@/Components/CarSearch/CarSearch'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAd, faAlignLeft, faFilterCircleXmark, faMultiply, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {Link} from '@inertiajs/react'
import {Transition} from '@headlessui/react'
import Hr from '@/Components/Hr'
import ListingsTopBar from '@/Components/Listing/Components/ListingsTopBar'
import SortMenu from '@/Components/Listing/Components/SortMenu'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import toast from 'react-hot-toast'
import {isArray} from 'lodash'
import SkeletonListingBlockItem from '@/Components/SkeletonListingBlockItem'

export default function ListingContainer ({ className, type = 'cars', presetCriteria = {} }) {

    const {
        settings, lang, automaticSize, setAutomaticSize, setHasSidebar, setIsSidebarOpen, isSidebarOpen, getPrefs, userPrefs,
    } = useContext(AppContext)

    const [showListingTopBar, setShowListingTopBar] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)

    const urlQuery = new URLSearchParams(window.location.search)

    const [isLoaded, setIsLoaded] = useState(false)

    const [sorting, setSorting] = useState(urlQuery.get('o') ?? 'latest')

    const [itemsView, setItemsView] = useState(getPrefs('listItemView') || 'list')
    const [items, setItems] = useState([])
    const [promotedItems, setPromotedItems] = useState([])
    const [itemsMeta, setItemsMeta] = useState([])

    const [searchDefaultFields, setSearchDefaultFields] = useState({
        location: urlQuery.has('location') ? urlQuery.get('location').split(',') ?? [] : [],
        makes: urlQuery.has('makes') ? urlQuery.get('makes').split(',') ?? [] : [],
        models: urlQuery.has('models') ? urlQuery.get('models').split(',') ?? [] : [],
        series: urlQuery.has('series') ? urlQuery.get('series').split(',') ?? [] : [],
        trims: urlQuery.has('trims') ? urlQuery.get('trims').split(',') ?? [] : [],
        ec: urlQuery.has('ec') ? urlQuery.get('ec').split(',') ?? [] : [],
        ic: urlQuery.has('ic') ? urlQuery.get('ic').split(',') ?? [] : [],
        im: urlQuery.has('im') ? urlQuery.get('im').split(',') ?? [] : [],
        co: urlQuery.has('co') ? urlQuery.get('co').split(',') ?? [] : [],
        yf: urlQuery.get('yf') || '',
        yt: urlQuery.get('yt') || '',
        c: urlQuery.get('c') || '',
        pf: urlQuery.get('pf') || '',
        pt: urlQuery.get('pt') || '',
        mf: urlQuery.get('mf') || '',
        mt: urlQuery.get('mt') || '',
        o: urlQuery.get('o') || '',
        page: urlQuery.get('page') || '',
    })

    const [criteria, setCriteria] = useState({ ...searchDefaultFields })

    useEffect(e => {
        setItemsView(getPrefs('listItemView') || 'list')
    }, [userPrefs])

    useEffect(e => {
        updateResults()
    }, [criteria])

    useEffect(e => {
        // Set the default values from url first
        setHasSidebar(true)
        setShowListingTopBar(true)
        setShowSidebar(true)
    }, [])

    const renderListingItem = (item, view = itemsView) => {
        switch (item?.type) {
            case 'car':
                return <ListingItemCarBlock key={'listingItem_' + item.id + item.sold_at} itemsView={view} sidebarOpen={isSidebarOpen} item={item}/>
            default:
                return <div></div>
        }
    }

    const updateResults = () => {

        let params = new URLSearchParams(criteria)

        let filteredCriteria = Object.entries(criteria).filter(e => {
            return (isArray(e[1]) && e[1].length) || (!isArray(e[1]) && e[1] !== '')
        })

        if (filteredCriteria.length) {
            let url = new URLSearchParams(filteredCriteria.values())
            window.history.pushState(this, null, '/?' + url.toString())
        }

        setIsLoaded(false)
        axios.post('/', params).then(res => {
            setItems(res.data.data)
            setPromotedItems(res.data.promoted)
            setItemsMeta(res.data.meta)

        }).catch(err => {
            toast.error(lang('Error'), { className: 'toast-error', position: 'bottom-center' })

        }).finally(fin => {
            setIsLoaded(true)

        })

    }

    const removeListingItem = (itemID) => {
        setItems((prevState) => prevState.filter(_item => _item.id !== itemID))
    }

    const updateListingItem = (updatedItem) => {
        setItems(() => [...items.map(i => i.id == updatedItem?.id ? updatedItem : i)])
    }

    /** Context Related Functions **/
    const listingProvider = {
        setItems: setItems,
        removeListingItem: removeListingItem,
        updateListingItem: updateListingItem,
        items: items,
        isLoaded: isLoaded,
        setIsLoaded: setIsLoaded,
        setCriteria: setCriteria,
        criteria: criteria,
        searchDefaultFields: searchDefaultFields,
        setSearchDefaultFields: setSearchDefaultFields,
        setIsSidebarOpen: setIsSidebarOpen,
        isSidebarOpen: isSidebarOpen,
        automaticSize: automaticSize,
        setAutomaticSize: setAutomaticSize,
        sorting: sorting,
        setSorting: setSorting,
        updateResults: updateResults,
    }

    return <div className={''} id={'listingBlock'}>
        <ListingContext.Provider value={{ ...listingProvider }}>
            <div className={'container'}>
                <div className={'pt-6 flex listing-items ' + (className ? ' ' + className : '')}>
                    <div
                        className={'sm:overflow-visible overflow-auto left-0 fixed md:relative z-[20] md:z-[13] sm:items-start justify-center items-center md:h-auto h-full ' +
                            (isSidebarOpen ? ' w-full md:w-6/12 lg:w-4/12 xl:w-4/12 sm:w-8/12' : ' !w-0 overflow-hidden')}>

                        <div
                            className={'lg:sticky fixed top-12 ml-2 bg-white bg-grad-primary rounded text-sm w-full transition-all h-screen max-h-[calc(100vh-60px)] ' +
                                'sm:max-h-[calc(100vh-45px)] shadow-sm dark:shadow-xl sm:px-5 md:px-2 px-1 lg:py-5 py-7  sm:pb-5 pb-16 ' +
                                (isSidebarOpen ? 'overflow-auto' : 'hidden !h-0 overflow-hidden')}
                            style={{ scrollbarWidth: 'thin' }}>

                            <PrimaryButton hideTextOnSmallScreen={false}
                                           onClick={() => setIsSidebarOpen(false)}
                                           icon={faMultiply} className={'absolute right-5 top-12 z-10 lg:hidden'}>Close</PrimaryButton>
                            <CarSearch className={'h-[calc(100vh-250px)] mx-5 delay-500'}/>
                        </div>

                    </div>

                    <div className={'dark:text-neutral-200 ' + (isSidebarOpen ? ' md:w-6/12 lg:w-8/12 xl:pl-5 xl:w-8/12' : ' !w-full ')}>

                        <Transition show={showListingTopBar}
                                    className={'sticky z-[12] top-12'}
                                    enter={'duration-1000'}
                                    enterFrom={'mt-40 opacity-0'}
                                    enterTo={'mt-0 opacity-100'}
                                    leave={'duration-1000'}
                                    leaveFrom={'mt-0 opacity-100'}
                                    leaveTo={'mt-40 opacity-0'}>
                            <div className={'text-xs bg-white shadow-sm bg-grad-primary-inverse px-5 mx-2 py-4 pb-4 justify-between items-center flex'}>

                                <ListingsTopBar className={(isSidebarOpen ? 'bg-neutral-900 text-white' : '') + ' animate-pop-in-lg'}
                                                icon={faAlignLeft} text={lang(isSidebarOpen ? 'Close Search' : 'Open Search')}
                                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}/>
                                {isLoaded ?
                                    <div className={'dark:text-neutral-600 text-neutral-400'}>
                                        {itemsMeta?.total ? itemsMeta.total + ' ' + lang('item(s) found') : lang('No Items Found')}
                                    </div>
                                    : <div className={'animate-pulse'}><FontAwesomeIcon className={'mx-1'} icon={faSpinner} spin={true}/><span className={'animate-pulse'}>{lang(
                                        'Searching...')}</span></div>}

                                <SortMenu/>

                            </div>
                        </Transition>

                        <div className={'w-full flex flex-wrap'}>
                            {promotedItems?.length ? <div className={'flex flex-wrap items-center px-5 xl:px-0 my-10 justify-center w-full'}>
                                <h5 className={'w-full font-normal text-sm text-neutral-300 dark:text-neutral-700'}>
                                    <FontAwesomeIcon icon={faAd} className={'mx-2'}/>{lang('Sponsors')}</h5>
                                <div className={'px-2'}>
                                    {isLoaded ? promotedItems && promotedItems.length ? promotedItems.map(promotedItem => <ListingItemCarBlock
                                        key={'pr_' + promotedItem.id}
                                        options={{
                                            showTitle: false, hideBody: true, hideFoot: true, showImage: true,
                                        }}
                                        item={promotedItem}
                                        className={'2xl:w-1/4'}/>) : <>
                                        <Skeleton loading={true}/>
                                    </> : <>
                                        <div className={'inline-block p-2 w-1/4 text-center'}>
                                            <Skeleton.Node className={'w-full'} active={true}/>
                                        </div>
                                        <div className={'inline-block p-2 w-1/4 text-center'}>
                                            <Skeleton.Node className={'w-full'} active={true}/>
                                        </div>
                                        <div className={'inline-block p-2 w-1/4 text-center'}>
                                            <Skeleton.Node className={'w-full'} active={true}/>
                                        </div>
                                        <div className={'inline-block p-2 w-1/4 text-center'}>
                                            <Skeleton.Node className={'w-full'} active={true}/>
                                        </div>
                                    </>}
                                </div>
                                <Hr className={'w-full'}/>
                            </div> : <></>}

                            <div className={'flex flex-wrap w-full items-stretch justify-stretch'}>
                                {isLoaded ? items?.length ? items.map(item => renderListingItem(item)) : <div
                                    className={'w-full flex flex-wrap items-center justify-center min-h-[400px] p-10 text-center' + ' dark:text-neutral-600'}>
                                    <p className={' dark:text-neutral-700 text-neutral-400'}>
                                        <FontAwesomeIcon
                                            className={'mr-1 w-full text-4xl'}
                                            icon={faFilterCircleXmark}/>
                                        <span className={'w-full text-sm'}>{lang('No Results Found')}</span>
                                    </p>
                                </div> : <SkeletonListingBlockItem num={11}/>
                                }
                            </div>
                        </div>

                        {itemsMeta && itemsMeta.last_page > 1 ? <div
                            className={'flex select-none flex-wrap justify-center my-5 items-center space-x-0.5 text-center'}>
                            {itemsMeta && itemsMeta.links?.map(link => <Link
                                key={'l_' + link.label}
                                href={link.url || ''}
                                disabled={!isLoaded || !link.url || link.active}
                                as={'button'}
                                className={'px-5 py-2 transition-all ' + ' rounded text-sm whitespace-nowrap' +
                                    (link.active ? ' active bg-red-500 dark:bg-red-800 text-white ' : ' dark:hover:bg-neutral-700 hover:bg-neutral-200' +
                                        ' disabled:!bg-transparent disabled:opacity-10')}
                                onClick={e => {
                                    if (!link?.url) {
                                        return false
                                    }
                                    setIsLoaded(false)
                                    axios.post(link.url).then(res => {
                                        setItems(res.data.data)
                                        setItemsMeta(res.data.meta)
                                    }).catch(err => {
                                    }).finally(() => {
                                        setIsLoaded(true)
                                    })
                                    document.getElementById('listingBlock').length && document.getElementById('listingBlock').scrollIntoView()
                                    window.history.pushState(this, null, link.url)
                                    e.preventDefault()
                                }}
                                dangerouslySetInnerHTML={{ __html: lang(link.label) }}/>)}
                            <div className={'mx-auto p-10 text-xs text-center dark:text-neutral-600 text-neutral-400'}>
                                {lang('Found a total of ')} {itemsMeta?.total} {lang('item(s)')}
                            </div>
                        </div> : <></>}

                    </div>
                </div>
            </div>
        </ListingContext.Provider>

    </div>
}
