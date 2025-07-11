import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '@/AppContext';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import Hr from '@/Components/Hr.jsx';
import TextInput from '@/Components/Form/TextInput.jsx';
import Loading from '@/Components/Loading.jsx';
import ShopBlock from '@/Components/Shops/ShopBlock.jsx';
import {AnimatePresence} from 'framer-motion';
import Card from '@/Components/Card.jsx';
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton.jsx';
import FlipWords from '@/Components/UI/flipwords.jsx';
import {Checkbox} from 'antd';
import Field from '@/Components/Form/Field.jsx';

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
        rating_min: 0,
        rating_max: 5,
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

    return <>
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


            <div className={'flex w-full items-start'}>
                <div className={'bg-white rounded-xl border w-2/6 p-10 pt-0'}>
                    <div className={'sticky top-32'}>
                        <h3>Filter Shops</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                type="text"
                                placeholder="Shop Name"
                                defaultValue={filters.title}
                                handleChange={(e) => setFilters(
                                    {...filters, title: e.target.value})}
                            />
                        </div>
                        <Field title={'Location'}
                               collapsable
                               className={'px-0'}
                               childrenClassName={'flex flex-wrap text-xs'}>
                            {predefined_locations?.data?.map((location) => (
                                <div className={'w-1/2 px-2 whitespace-nowrap'}>
                                    <Checkbox key={location.id}
                                              value={location.id}
                                              onChange={(e) => setFilters({
                                                  ...filters,
                                                  predefined_location: e.target.checked
                                                      ? filters.predefined_location
                                                          ? filters.predefined_location +
                                                          ',' + location.id.toString()
                                                          : location.id.toString()
                                                      : filters.predefined_location.split(
                                                          ',').
                                                          filter(t => t !==
                                                              location.id.toString()).
                                                          join(','),
                                              })}
                                    >{location.name}</Checkbox>
                                </div>
                            ))}
                        </Field>
                        <Hr/>
                        <Field title={'Type of Service'}
                               className={'px-0'}
                               collapsable
                               childrenClassName={'flex flex-wrap my-5'}>
                            {types.map((type) => (
                                <div className={'w-1/2 px-2 whitespace-nowrap'}>
                                    <Checkbox
                                        value={type.id}
                                        defaultChecked={filters.type ===
                                            type.id.toString()}
                                        className={'!p-0'}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            type: e.target.checked
                                                ? filters.type
                                                    ? filters.type + ',' +
                                                    type.id.toString()
                                                    : type.id.toString()
                                                : filters.type.split(',').
                                                    filter(t => t !==
                                                        type.id.toString()).
                                                    join(','),
                                        })}
                                    >
                                        {type.title}</Checkbox>
                                </div>

                            ))}
                        </Field>

                        <Field title={'Rating'}
                               className={'px-0'}
                               collapsable
                               childrenClassName={'my-5'}>
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Min: {filters.rating_min} stars</span>
                                    <span className="text-sm">Max: {filters.rating_max} stars</span>
                                </div>
                                <div className="flex space-x-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.5"
                                        value={filters.rating_min}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            rating_min: parseFloat(e.target.value),
                                            rating_max: Math.max(parseFloat(e.target.value), filters.rating_max)
                                        })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.5"
                                        value={filters.rating_max}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            rating_max: parseFloat(e.target.value),
                                            rating_min: Math.min(parseFloat(e.target.value), filters.rating_min)
                                        })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs">0</span>
                                    <span className="text-xs">1</span>
                                    <span className="text-xs">2</span>
                                    <span className="text-xs">3</span>
                                    <span className="text-xs">4</span>
                                    <span className="text-xs">5</span>
                                </div>
                            </div>
                        </Field>
                        <PrimaryButton
                            className="mt-4"
                            icon={faSearch}
                            onClick={fetchShops}
                        >
                            Search
                        </PrimaryButton></div>
                </div>

                <div className={'w-4/6 px-10'}>
                    {
                        loading ? (
                            <div className="min-h-[50vh]">
                                <Loading loadingText="Loading shops..." className="py-44" background="" />
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
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-20">
                                    {shops.map(
                                        (shop) => <ShopBlock variant={'wide'}
                                                             shop={shop}
                                                             key={shop.id}/>)}
                                </div>

                                <Hr className={'my-20'}/>
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


            <Hr className={'my-14 max-w-xs mx-auto'}/>
            <div>
                <Card
                    className={'max-w-md mx-auto'} header={
                    <h2 className={'font-black'}>
                        Ready To Get Started?</h2>
                }>
                    <p>Join thousands of satisfied customers who trust our
                        premium automotive partners</p>
                    <div className={'my-10 flex items-center justify-center'}>
                        <PrimaryButton>Create a Shop</PrimaryButton>
                    </div>
                </Card>
            </div>
        </div>
    </>;
}
