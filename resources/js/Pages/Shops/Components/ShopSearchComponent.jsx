import React from 'react';
import TextInput from '@/Components/Form/TextInput.jsx';
import Field from '@/Components/Form/Field.jsx';
import {Checkbox, DatePicker} from 'antd';
import Hr from '@/Components/Hr.jsx';
import {ShopTypeIcons} from '@/Components/Icons/ShopTypes/index.js';
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton.jsx';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

function ShopSearchComponent({filters, setFilters, predefined_locations, types, fetchShops = () => {}}) {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return <>
        <>
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
                   childrenClassName={'flex flex-wrap'}>
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

                {types.map((type) => {
                    const IconComponent = ShopTypeIcons[type.id];
                    return <div className={'w-1/2 px-2 whitespace-nowrap'}>
                        <Checkbox
                            value={type.id}
                            defaultChecked={filters.type === type.id.toString()}
                            onChange={(e) => setFilters({
                                ...filters,
                                type: e.target.checked
                                    ? filters.type
                                        ? filters.type + ',' + type.id.toString()
                                        : type.id.toString()
                                    : filters.type.split(',').
                                        filter(t => t !== type.id.toString()).join(','),
                            })}
                        >
                            {IconComponent && <IconComponent className="w-4 h-4 inline-block mr-2 -mt-0.5"/>}
                            {type.title}
                        </Checkbox>
                    </div>;
                })}
            </Field>

            <Field title={'Rating'}
                   className={'px-0'}
                   collapsable
                   childrenClassName={'my-5'}>
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Min: {filters.rating_min === null ? 'NA' : filters.rating_min} stars</span>
                        <span className="text-sm">Max: {filters.rating_max === null ? 'NA' : filters.rating_max} stars</span>
                    </div>
                    <div className="flex space-x-4">
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={filters.rating_min ?? 0}
                            onChange={(e) => setFilters({
                                ...filters,
                                rating_min: e.target.value === '0' ? null : parseFloat(e.target.value),
                                rating_max: e.target.value === '0' ? null : Math.max(parseFloat(e.target.value), filters.rating_max ?? 5),
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={filters.rating_max ?? 5}
                            onChange={(e) => setFilters({
                                ...filters,
                                rating_max: e.target.value === '5' ? null : parseFloat(e.target.value),
                                rating_min: e.target.value === '5' ? null : Math.min(parseFloat(e.target.value), filters.rating_min ?? 0),
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

            <Hr/>

            <Field title={'Opening Hours'}
                   className={'px-0'}
                   collapsable
                   childrenClassName={'my-5'}>
                <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Opening Time</label>
                            <TextInput
                                type="time"
                                placeholder="Opening Time"
                                defaultValue={filters.opening_time || ''}
                                handleChange={(e) => setFilters({
                                    ...filters,
                                    opening_time: e.target.value
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Closing Time</label>
                            <TextInput
                                type="time"
                                placeholder="Closing Time"
                                defaultValue={filters.closing_time || ''}
                                handleChange={(e) => setFilters({
                                    ...filters,
                                    closing_time: e.target.value
                                })}
                            />
                        </div>
                    </div>
                </div>
            </Field>

            <Field title={'Opening Days'}
                   className={'px-0'}
                   collapsable
                   childrenClassName={'flex flex-wrap my-5'}>
                {weekdays.map((day) => (
                    <div className={'w-1/2 px-2 whitespace-nowrap'} key={day}>
                        <Checkbox
                            value={day}
                            onChange={(e) => {
                                const currentDays = filters.opening_days ? filters.opening_days.split(',') : [];
                                let newDays;

                                if (e.target.checked) {
                                    newDays = [...currentDays, day];
                                } else {
                                    newDays = currentDays.filter(d => d !== day);
                                }

                                setFilters({
                                    ...filters,
                                    opening_days: newDays.join(',')
                                });
                            }}
                        >
                            {day}
                        </Checkbox>
                    </div>
                ))}
            </Field>

            <Field title={'Established Date'}
                   className={'px-0'}
                   collapsable
                   childrenClassName={'my-5'}>
                <div className="flex flex-col space-y-4">
                    <DatePicker
                        placeholder="Select established date"
                        onChange={(date, dateString) => setFilters({
                            ...filters,
                            established_date: dateString
                        })}
                        className="w-full"
                    />
                </div>
            </Field>
            <PrimaryButton
                className="mt-4"
                icon={faSearch}
                onClick={fetchShops}
            >
                Search
            </PrimaryButton>
        </>
    </>;
}

export default ShopSearchComponent;
