import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '@/AppContext';
import Hr from '@/Components/Hr.jsx';
import FilterBadges from '@/Components/Shops/FilterBadges.jsx';
import Loading from '@/Components/Loading.jsx';
import ShopBlock from '@/Components/Shops/ShopBlock.jsx';
import {AnimatePresence} from 'framer-motion';
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton.jsx';
import FlipWords from '@/Components/UI/flipwords.jsx';
import SwipeableContainer from '@/Components/UI/SwipeableContainer.jsx';
import ShopSearchComponent from '@/Pages/Shops/Components/ShopSearchComponent.jsx';

export default function Index({types, predefined_locations = []}) {
    const [shops, setShops] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        links: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        type: '',
        contact_method: '',
        predefined_location: '',
        rating_min: null,
        rating_max: null,
    });
    const {api} = useContext(AppContext);

    useEffect(() => {
        fetchShops();
    }, [filters]);

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }, 100);
    }, []);

    const fetchShops = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(route('api.shops.index'), {
                params: filters,
            });

            setShops(response.data?.data ?? []);

            setPagination({
                current_page: response.data?.meta.current_page,
                last_page: response.data?.meta.last_page,
                per_page: response.data?.meta.per_page,
                total: response.data?.meta.total,
                links: response.data?.meta.links,
            });

        } catch (error) {
            console.error('Error fetching shops:', error);
            setError(error.message || 'An error occurred while fetching shops');
            setShops([]);
        } finally {
            setLoading(false);
        }
    };

    const [swiping, setSwiping] = useState(false);

    const goToNextPage = () => {
        if (pagination.current_page < pagination.last_page && !swiping) {
            console.log(`Navigating to next page: ${pagination.current_page + 1}`);
            setSwiping(true);
            setFilters(prev => ({
                ...prev,
                page: pagination.current_page + 1,
            }));
            // Reset swiping state after navigation completes
            setTimeout(() => setSwiping(false), 500);
        }
    };

    const goToPreviousPage = () => {
        if (pagination.current_page > 1 && !swiping) {
            console.log(`Navigating to previous page: ${pagination.current_page - 1}`);
            setSwiping(true);
            setFilters(prev => ({
                ...prev,
                page: pagination.current_page - 1,
            }));
            // Reset swiping state after navigation completes
            setTimeout(() => setSwiping(false), 500);
        }
    };

    return <div className={'dark:bg-background bg-white'}>
        <div className="container mt-32 mx-auto p-4">

            <div className={'max-w-4xl my-20 mb-32 dark:drop-shadow-[0_0px_100px_#fff] drop-shadow-[0_0px_100px_#acf] mx-auto text-center'}>
                <h1>Find Your Perfect
                    <p className={'refined-gradient'}>
                        <AnimatePresence mode="wait">
                            <FlipWords words={[
                                'Shop',
                                'Showroom',
                                'Tuner',
                                'Rentals',
                                'Service Center']}/>
                        </AnimatePresence>
                    </p>
                </h1>
                <p className={'-mt-40'}>Connect with verified showrooms,
                    expert tuners, luxury
                    rentals, and premium service centers. Experience
                    automotive excellence at every level.</p>
            </div>


            <div className={'flex bg-card shadow-xl shadow-black/5 w-full'}>
                <div className={'w-2/6 p-8 pt-0'}>
                    <div className={'sticky top-32'}>
                        <ShopSearchComponent filters={filters}
                                             setFilters={setFilters} predefined_locations={predefined_locations} types={types} fetchShops={fetchShops}/>
                    </div>
                </div>

                <div className={'w-4/6 px-10'}>
                    {!loading && <FilterBadges filters={filters} setFilters={setFilters} types={types} predefinedLocations={predefined_locations}/>}
                    {
                        loading ? (
                            <div className="min-h-[50vh]">
                                <Loading loadingText="Loading shops..." className="py-44" background=""/>
                            </div>
                        ) : error ? (
                            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                                <div className="text-center p-10 rounded-lg bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800">
                                    <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Error</h3>
                                    <p className="text-red-500 dark:text-red-300">{error}</p>
                                    <button
                                        onClick={fetchShops}
                                        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-600 dark:text-red-200 rounded-md text-sm font-medium transition-colors">
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        ) : shops.length > 0 ? (
                            <>
                                <SwipeableContainer
                                    onSwipeLeft={() => {
                                        if (pagination.current_page < pagination.last_page) {
                                            goToNextPage();
                                        }
                                    }}
                                    onSwipeRight={() => {
                                        if (pagination.current_page > 1) {
                                            goToPreviousPage();
                                        }
                                    }}
                                    canSwipeLeft={pagination.current_page < pagination.last_page}
                                    canSwipeRight={pagination.current_page > 1}
                                    className="min-h-[50vh] w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 py-20">
                                        {shops.map(
                                            (shop) => <ShopBlock
                                                shop={shop}
                                                key={shop.id}/>)}
                                    </div>
                                </SwipeableContainer>


                                <Hr className={'my-20'}/>
                                <div className="text-center mb-6">
                                    <div className="text-sm text-gray-500 mb-2">
                                        <span>Swipe left or right to navigate between pages</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        {pagination.current_page > 1 && (
                                            <button
                                                onClick={goToPreviousPage}
                                                className="text-primary text-sm hover:underline cursor-pointer"
                                            >← Previous page</button>
                                        )}
                                        <span className="text-gray-400 mx-2">Page {pagination.current_page} of {pagination.last_page}</span>
                                        {pagination.current_page < pagination.last_page && (
                                            <button
                                                onClick={goToNextPage}
                                                className="text-primary text-sm hover:underline cursor-pointer"
                                            >Next page →</button>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="flex items-center justify-center gap-2 mt-6">
                                    {pagination.links.map((link, index) => (
                                        <button
                                            key={index}
                                            className={`px-4 py-2 text-xs select-none rounded ${
                                                link.active
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background hover:bg-gray-300 dark:hover:bg-neutral-700'
                                            } ${!link.url
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''}`}
                                            onClick={() => {
                                                if (link.url) {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        page: link.label,
                                                    }));
                                                }
                                            }}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{__html: link.label}}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                                <div className="text-center p-10 rounded-lg bg-white/5 backdrop-blur-sm">
                                    <h3 className="text-xl font-semibold mb-2">No shops found</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters to find more results.</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


            <Hr className={'my-32 max-w-xs mx-auto'}/>
            <div>
                <div className={'container text-center'}>
                    <h2 className={'font-black text-6xl'}>
                        Ready To Get Started?
                    </h2>
                    
                    <p>Join thousands of satisfied customers who trust our premium automotive partners</p>

                    <div className={'my-10 flex items-center justify-center'}>
                        <PrimaryButton>Create a Shop</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}
