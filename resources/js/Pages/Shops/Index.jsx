import PageContainer from "@/Layouts/PageContainer.jsx";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "@/AppContext";
import MainButton from "@/Components/Form/Buttons/MainButton";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import Hr from "@/Components/Hr.jsx";
import ShopBlock from "@/Pages/Shops/Components/ShopBlock.jsx";
import Checkbox from "@/Components/Form/Checkbox.jsx";
import Select from "@/Components/Form/Select.jsx";
import TextInput from "@/Components/Form/TextInput.jsx";

export default function Index({types, predefined_locations = []}) {
    const [shops, setShops] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        links: []
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

    const fetchShops = async () => {
        setLoading(true);
        try {
            const response = await api.get(route('api.shops.index'), {
                params: filters
            });

            setShops(response.data?.data ?? []);

            setPagination({
                current_page: response.data?.meta.current_page,
                last_page: response.data?.meta.last_page,
                per_page: response.data?.meta.per_page,
                total: response.data?.meta.total,
                links: response.data?.meta.links
            });

        } catch (error) {
            console.error('Error fetching shops:', error);
        } finally {
            setLoading(false);
        }
    };

    return <PageContainer title={'Shops'}>
        <div className="container mx-auto p-4">
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <TextInput
                        type="text"
                        placeholder="Shop Name"
                        defaultValue={filters.title}
                        handleChange={(e) => setFilters({...filters, title: e.target.value})}
                    />


                    <Select
                        defaultValue={predefined_locations.data[0].id}
                        options={predefined_locations?.data?.map(pL => ({
                            id: pL.id,
                            label: pL.name,
                            value: pL.id,
                        })) ?? []}
                        value={filters.predefined_location}
                        onChange={(e) => setFilters({...filters, predefined_location: e.target.value})}
                    >
                        <option value="">Select Predefined Location</option>
                        {predefined_locations?.data?.map((location) => (
                            <option key={location.id} value={location.id}>{location.name}</option>
                        ))}
                    </Select>
                </div>

                <div className={'flex gap-2 flex-wrap'}>
                    {types.map((type) => (
                        <div className={'my-5'}>
                            <Checkbox
                                className={'w-min'}
                                label={type.title}
                                checked={filters.type === type.id.toString()}
                                onChange={(e) => setFilters({
                                    ...filters,
                                    type: e.target.checked ? type.id.toString() : ''
                                })}
                            /></div>


                    ))}
                </div>

                <MainButton
                    className="mt-4"
                    icon={faSearch}
                    onClick={fetchShops}
                >
                    Search
                </MainButton>
            </>


            {
                loading ? (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-20">
                            {shops.map((shop) => <ShopBlock shop={shop} key={shop.id}/>)}
                        </div>

                        <Hr className={'my-20'}/>
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {pagination.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 text-xs select-none rounded ${
                                        link.active
                                            ? 'bg-primary text-white'
                                            : 'bg-background hover:bg-gray-300 dark:hover:bg-neutral-700'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                        if (link.url) {
                                            setFilters(prev => ({
                                                ...prev,
                                                page: link.label
                                            }))
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
    </PageContainer>
}
