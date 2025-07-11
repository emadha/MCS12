import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '@/AppContext';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import Hr from '@/Components/Hr.jsx';
import TextInput from '@/Components/Form/TextInput.jsx';
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
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        type: '',
        contact_method: '',
        predefined_location: '',
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
        } finally {
            setLoading(false);
        }
    };

    return <>
        <div className="container mt-32 mx-auto p-4">
            <>
                <div
                    className={'max-w-4xl my-20 mb-32 drop-shadow-[0_0px_100px_#fff] mx-auto text-center'}>
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
            </>

            <div className={'flex w-full items-start'}>
                <Card className={'w-1/4 px-5'}>
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
                        <PrimaryButton
                            className="mt-4"
                            icon={faSearch}
                            onClick={fetchShops}
                        >
                            Search
                        </PrimaryButton></div>
                </Card>

                <div className={'w-3/4 px-10'}>
                    {
                        loading ? (
                            <div
                                className="flex justify-center items-center min-h-[50vh]">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
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
