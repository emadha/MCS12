import {useContext, useEffect, useState} from 'react';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import Select from '@/Components/Form/Select';
import InputLabel from '@/Components/Form/InputLabel';
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton';
import {faBars, faCar, faCarRear, faCarSide, faS, faSearch, faSortNumericAsc} from '@fortawesome/free-solid-svg-icons';
import {ListingContext} from '@/Context/ListingContext';
import TextInput from '@/Components/Form/TextInput';
import Hr from '@/Components/Hr';
import SkeletonInput from 'antd/es/skeleton/Input';
import {AppContext} from '@/AppContext';
import defaultTheme from 'tailwindcss/defaultTheme';
import {Checkbox} from 'antd';
import {xor} from 'lodash';
import Field from '@/Components/Form/Field';

export default function CarSearch({className}) {
    const {
        setCriteria, criteria,
        searchDefaultFields, setSearchDefaultFields,
        isLoaded,
        setIsSidebarOpen,
        sorting,
    } = useContext(ListingContext);

    const {lang, settings} = useContext(AppContext);

    const [searchCriteriaLoaded, setSearchCriteriaLoaded] = useState(false);

    const [selectedLocation, setSelectedLocation] = useState(searchDefaultFields.location);

    const [carMakeOptions, setCarMakeOptions] = useState([]);
    const [selectedCarMake, setSelectedCarMake] = useState(searchDefaultFields.makes);

    const [carModelOptions, setCarModelOptions] = useState([]);
    const [selectedCarModel, setSelectedCarModel] = useState(searchDefaultFields.models);

    const [carSeriesOptions, setCarSeriesOptions] = useState([]);
    const [selectedCarSeries, setSelectedCarSeries] = useState(searchDefaultFields.series);

    const [carTrimOptions, setCarTrimOptions] = useState([]);
    const [selectedCarTrim, setSelectedCarTrim] = useState(searchDefaultFields.trims);

    const [selectedExteriorColor, setSelectedExteriorColor] = useState(searchDefaultFields.ec);
    const [selectedInteriorColor, setSelectedInteriorColor] = useState(searchDefaultFields.ic);
    const [selectedInteriorMaterial, setSelectedInteriorMaterial] = useState(searchDefaultFields.im);
    const [selectedCondition, setSelectedCondition] = useState(searchDefaultFields.co);

    const [selectedCurrency, setSelectedCurrency] = useState(searchDefaultFields.c);
    const [selectedPriceFrom, setSelectedPriceFrom] = useState(searchDefaultFields.pf);
    const [selectedPriceTo, setSelectedPriceTo] = useState(searchDefaultFields.pt);

    const [selectedCarYearFrom, setSelectedCarYearFrom] = useState(searchDefaultFields.yf);
    const [selectedCarYearTo, setSelectedCarYearTo] = useState(searchDefaultFields.yt);

    const [mileageMin, setMileageMin] = useState(searchDefaultFields.mf);
    const [mileageMax, setMileageMax] = useState(searchDefaultFields.mt);

    const handleCarMakeChange = e => setSelectedCarMake(e?.value.join(','));
    const handleCarModelChange = e => setSelectedCarModel(e?.value.join(','));
    const handleCarSeriesChange = e => setSelectedCarSeries(e?.value.join(','));
    const handleCarTrimChange = e => setSelectedCarTrim(e?.value.join(','));
    const handleCurrencyChange = e => setSelectedCurrency(e?.value.toString());

    const getSearchDefaultFields = () => {
        axios.post(route('api.search.defaults')).then(r => {
            setSearchDefaultFields({...searchDefaultFields, ...r.data});
            setSearchCriteriaLoaded(true);
        });
    };

    useEffect(() => {
        initMakes();
        getSearchDefaultFields();
    }, []);

    useEffect(e => {
        getCarModels();
    }, [selectedCarMake]);

    useEffect(e => {
        getCarSeries();
    }, [selectedCarModel]);

    useEffect(e => {
        getCarTrims();
    }, [selectedCarSeries]);

    useEffect(e => {

    }, [selectedCarTrim]);

    const initMakes = () => {
        axios.post(route('api.cars.makes')).then(r => {
            setCarMakeOptions(r.data.map(d => {
                return {label: d.make, value: d.make_slug};
            }) ?? []);
        });
    };

    const getCarModels = () => {
        setCarModelOptions([]);
        setSelectedCarModel('');
        selectedCarMake?.length &&
        axios.post(route('api.cars.makes.models', {makes: selectedCarMake})).then(r =>
            setCarModelOptions(r.data.map(model => {
                return {label: model.model, value: model.model_slug};
            })));
    };

    const getCarSeries = () => {
        setCarSeriesOptions([]);
        setSelectedCarSeries('');
        selectedCarModel?.length && axios.post(route('api.cars.makes.models.series', {
            makes: selectedCarMake,
            models: selectedCarModel,
        })).then(r => setCarSeriesOptions(r.data.map(model => {
            return {label: model.series, value: model.series_slug};
        })));

    };

    const getCarTrims = () => {
        setCarTrimOptions([]);
        setSelectedCarTrim('');
        selectedCarSeries?.length &&
        axios.post(route('api.cars.makes.models.series.trims', {
            makes: selectedCarMake,
            models: selectedCarModel,
            series: selectedCarSeries,
        })).then(r => setCarTrimOptions(r.data.map(model => {
            return {label: model.trim, value: model.trim_slug};
        })));
    };

    const submit = (e) => {
        e && e.preventDefault();

        if (window.innerWidth < parseInt(defaultTheme.screens.lg)) {
            setIsSidebarOpen(false);
        }

        setCriteria({
            // type: 'car',
            makes: selectedCarMake || [],
            models: selectedCarModel || [],
            series: selectedCarSeries || [],
            trims: selectedCarTrim || [],
            ec: selectedExteriorColor || [],
            ic: selectedInteriorColor || [],
            im: selectedInteriorMaterial || [],
            co: selectedCondition || [],
            mf: mileageMin || '',
            mt: mileageMax || '',
            yf: selectedCarYearFrom || '',
            yt: selectedCarYearTo || '',
            c: selectedCurrency || '',
            pf: selectedPriceFrom || '',
            pt: selectedPriceTo || '',
            location: selectedLocation || [],
        });
    };
    const handleLocationChange = (e) => {
        setSelectedLocation(prevState => xor([...prevState], [e.target.value]));
    };

    useEffect(() => {
        // if you want to auto update items on criteria change
        // place code here
    }, [
        selectedCurrency, selectedPriceFrom, selectedPriceTo,
        selectedCarYearFrom, selectedCarYearTo,
        selectedExteriorColor, selectedInteriorColor, selectedInteriorMaterial,
        mileageMin, mileageMax,
        selectedLocation,
        selectedCarMake, selectedCarModel, selectedCarSeries, selectedCarTrim,
        selectedCondition,
    ]);

    return <div className={'pr-2 rtl:pl-2 '
        + (className ? ' ' + className : '')}
                style={{scrollbarWidth: 'thin'}}>

        <div className={''} style={{scrollbarWidth: 'thin'}}>

            <h2 className={''}>{lang('Search')}</h2>
            <p>{lang('Use the fields below to filter your search, then press')} <b>{lang('Search')}</b>.</p>
            <Hr/>

            <form className={'@container'} action={'/'} method={'post'} onSubmit={submit}>
                <InputLabel>{lang('Price')}</InputLabel>
                <div
                    className={'flex gap-x-2 flex-wrap sm:flex-nowrap sm:space-y-0 space-y-3 items-center justify-around'}>

                    {searchCriteriaLoaded
                        ? <Select options={searchDefaultFields.currency}
                                  handleOnChange={handleCurrencyChange}
                                  name={'c'}
                                  className={'w-full sm:w-1/3'}
                                  defaultValue={selectedCurrency}
                                  placeholder={lang('Currency')}
                                  disabled={!isLoaded}
                                  clearable={!!selectedCurrency}/>
                        : <SkeletonInput block={true}
                                         active={true}
                                         style={{minHeight: '44px'}}/>
                    }

                    {searchCriteriaLoaded
                        ? <TextInput name={'pf'}
                                     className={'w-full sm:w-1/3'}
                                     type={'number'}
                                     disabled={!isLoaded}
                                     min={0}
                                     placeholder={lang('From') + ' ' + lang('Price')}
                                     handleChange={e => setSelectedPriceFrom(e.target.value)}
                                     defaultValue={selectedPriceFrom}
                                     icon={faSortNumericAsc}/>
                        : <SkeletonInput block={true}
                                         active={true}
                                         style={{minHeight: '44px'}}/>
                    }
                    {searchCriteriaLoaded
                        ? <TextInput name={'pt'}
                                     className={'w-full sm:w-1/3'}
                                     type={'number'}
                                     disabled={!isLoaded}
                                     min={1}
                                     placeholder={lang('To') + ' ' + lang('Price')}
                                     handleChange={e => setSelectedPriceTo(e.target.value)}
                                     defaultValue={selectedPriceTo}
                                     icon={faSortNumericAsc}/>
                        : <SkeletonInput block={true}
                                         active={true}
                                         style={{minHeight: '44px'}}/>
                    }
                </div>

                <div className={'my-5'}>
                    <InputLabel>{lang('Location')}</InputLabel>
                    {searchDefaultFields?.locations && searchDefaultFields.locations?.length ? <div className={'text-center @xs:columns-2'}>
                            {searchDefaultFields.locations.map(
                                location => <Checkbox
                                    key={location.name}
                                    title={lang(location.name)}
                                    disabled={!isLoaded}
                                    value={location.name}
                                    defaultChecked={selectedLocation.includes(location.name)}
                                    onChange={handleLocationChange}>
                                    {lang(location.name)}
                                </Checkbox>,
                            )}
                        </div>
                        : <></>}
                </div>

                <div className={'my-1'}>
                    <InputLabel>{lang('Year')}</InputLabel>
                    <div className={'flex gap-x-2'}>

                        {searchCriteriaLoaded
                            ? <TextInput name={'yf'}
                                         type={'number'}
                                         className={'w-1/2'}
                                         disabled={!isLoaded}
                                         min={searchDefaultFields?.year?.min}
                                         max={searchDefaultFields?.year?.max}
                                         placeholder={lang('From') + ' ' + lang('Year')}
                                         icon={faCalendar}
                                         defaultValue={selectedCarYearFrom}
                                         handleChange={e => setSelectedCarYearFrom(e.target.value)}/>
                            : <div className={'w-1/2'}>
                                <SkeletonInput block={true}
                                               active={true}
                                               style={{minHeight: '44px'}}/>
                            </div>
                        }
                        {searchCriteriaLoaded
                            ? <TextInput name={'yt'}
                                         className={'w-1/2'}
                                         min={searchDefaultFields?.year?.min}
                                         max={searchDefaultFields?.year?.max}
                                         type={'number'}
                                         disabled={!isLoaded}
                                         placeholder={lang('To') + ' ' + lang('Year')}
                                         icon={faCalendar}
                                         defaultValue={selectedCarYearTo}
                                         handleChange={e => setSelectedCarYearTo(e.target.value)}/>
                            : <div className={'w-1/2'}>
                                <SkeletonInput block={true}
                                               active={true}
                                               style={{minHeight: '44px'}}/>
                            </div>
                        }
                    </div>
                </div>

                <div className={'my-2'}>
                    <InputLabel>{lang('Make')}</InputLabel>
                    <Select name={'make'}
                            clearable={true}
                            options={carMakeOptions}
                            disabled={!isLoaded}
                            placeholder={lang('Select')}
                            leftIcon={faCar}
                            multi={true}
                            defaultValue={selectedCarMake}
                            handleOnChange={handleCarMakeChange}/>
                </div>


                {selectedCarMake && selectedCarMake.length
                    ? <div className={'my-1 relative'}>
                        <InputLabel>Model</InputLabel>
                        <Select name={'model'}
                                options={carModelOptions}
                                handleOnChange={handleCarModelChange}
                                placeholder={lang('Select')}
                                leftIcon={faCarRear}
                                multi={true}
                                defaultValue={selectedCarModel}
                                disabled={!selectedCarMake || !isLoaded}/>
                    </div>
                    : <></>
                }

                {selectedCarMake && selectedCarMake.length
                    ? <div className={'my-1 relative'}>
                        <InputLabel>Series</InputLabel>
                        <Select name={'series'}
                                options={carSeriesOptions}
                                handleOnChange={handleCarSeriesChange}
                                placeholder={lang('Select')}
                                leftIcon={faS}
                                multi={true}
                                defaultValue={selectedCarSeries}
                                disabled={!selectedCarModel || !isLoaded}/>
                    </div>
                    : <></>
                }

                {selectedCarMake && selectedCarMake.length
                    ? <div className={'my-1'}>
                        <InputLabel>Trim</InputLabel>
                        <Select name={'trim'}
                                options={carTrimOptions}
                                handleOnChange={handleCarTrimChange}
                                placeholder={lang('Select')}
                                leftIcon={faCarSide}
                                multi={true}
                                defaultValue={selectedCarTrim}
                                disabled={!selectedCarSeries || !isLoaded}/>
                    </div>
                    : <></>
                }
                <Hr/>
                <div className={'my-2'}>
                    <InputLabel>{lang('Exterior Color')}</InputLabel>
                    {
                        searchCriteriaLoaded ?
                            <Select name={'ec'}
                                    multi={true}
                                    clearable={true}
                                    options={searchDefaultFields.exterior_color}
                                    leftIcon={faBars}
                                    disabled={!isLoaded}
                                    handleOnChange={e => setSelectedExteriorColor(e?.value)}
                                    defaultValue={selectedExteriorColor?.filter(_ => _).map(e => parseInt(e))}
                                    placeholder={lang('Select')}/>

                            : <div>
                                <SkeletonInput block={true}
                                               active={true}
                                               style={{minHeight: '44px'}}/>
                            </div>
                    }
                </div>

                <div className={'my-2'}>
                    <InputLabel>{lang('Interior Color')}</InputLabel>
                    {searchCriteriaLoaded
                        ? <Select name={'ic'}
                                  multi={true}
                                  options={searchDefaultFields.interior_color}
                                  leftIcon={faBars}
                                  disabled={!isLoaded}
                                  handleOnChange={e => setSelectedInteriorColor(e?.value)}
                                  defaultValue={selectedInteriorColor?.map(e => parseInt(e))}
                                  placeholder={lang('Select')}
                        />
                        : <div>
                            <SkeletonInput block={true}
                                           active={true}
                                           style={{minHeight: '44px'}}/>
                        </div>
                    }
                </div>
                <div className={'my-2'}>
                    <InputLabel>{lang('Interior Material')}</InputLabel>
                    {searchCriteriaLoaded
                        ? <Select name={'im'}
                                  leftIcon={faBars}
                                  multi={true}
                                  disabled={!isLoaded}
                                  options={searchDefaultFields.interior_material}
                                  handleOnChange={e => setSelectedInteriorMaterial(e?.value)}
                                  defaultValue={selectedInteriorMaterial?.map(e => parseInt(e))}
                                  placeholder={lang('Select')}
                        />
                        : <div>
                            <SkeletonInput block={true}
                                           active={true}
                                           style={{minHeight: '44px'}}/>
                        </div>
                    }
                </div>

                <div className={'my-2'}>

                    <InputLabel>{lang('Condition')}</InputLabel>
                    {searchCriteriaLoaded
                        ? <Select name={'co'}
                                  options={searchDefaultFields.conditions}
                                  handleOnChange={e => setSelectedCondition(e?.value)}
                                  multi={true}
                                  disabled={!isLoaded}
                                  placeholder={lang('Select')}
                                  defaultValue={selectedCondition?.map(e => parseInt(e))}
                                  leftIcon={faBars}/>
                        : <div>
                            <SkeletonInput block={true}
                                           active={true}
                                           style={{minHeight: '44px'}}/>
                        </div>
                    }
                </div>
                <div className={'my-2'}>
                    <InputLabel>{lang('Odometer')}</InputLabel>

                    {searchCriteriaLoaded
                        ?
                        <div className={'flex w-full gap-x-2'}>
                            <div className={'w-full xl:w-1/2 duration-1000'}>
                                <TextInput name={'mf'}
                                           type={'number'}
                                           icon={faSortNumericAsc}
                                           disabled={!isLoaded}
                                           placeholder={lang('From')}
                                           defaultValue={mileageMin}
                                           handleChange={e => setMileageMin(e.target.value)}/>
                            </div>
                            <div className={'w-full xl:w-1/2 flex duration-1000'}>
                                <TextInput name={'mt'}
                                           type={'number'}
                                           disabled={!isLoaded}
                                           icon={faSortNumericAsc}
                                           placeholder={lang('To')}
                                           defaultValue={mileageMax}
                                           handleChange={e => setMileageMax(e.target.value)}/>
                            </div>
                        </div>

                        : <div className={'flex'}>
                            <SkeletonInput block={true} active={true} style={{minHeight: '44px'}}/>
                            <SkeletonInput block={true} active={true} style={{minHeight: '44px'}}/>
                        </div>
                    }

                </div>

                <div className={'mb-16'}>
                    <Field title={'Advanced'} collapsable={true}>

                        <Field>
                            <InputLabel>Horsepower</InputLabel>
                            <div className={'flex gap-x-2'}>
                                <TextInput name={'hp_min'} placeholder={'min'}/>
                                <TextInput name={'hp_max'} placeholder={'max'}/>
                            </div>
                        </Field>

                        <Field>
                            <InputLabel>Torque</InputLabel>
                            <div className={'flex gap-x-2'}>
                                <TextInput name={'torque_min'} placeholder={'min'}/>
                                <TextInput name={'torque_max'} placeholder={'max'}/>
                            </div>
                        </Field>

                        <Field>
                            <InputLabel>Width (mm)</InputLabel>
                            <div className={'flex gap-x-2'}>
                                <TextInput name={'width_mm_min'} placeholder={'min'}/>
                                <TextInput name={'width_mm_max'} placeholder={'max'}/>
                            </div>
                        </Field>

                        <Field>
                            <InputLabel>Full Weight (kg)</InputLabel>
                            <div className={'flex gap-x-2'}>
                                <TextInput name={'full_weight_min'} placeholder={'min'}/>
                                <TextInput name={'full_weight_max'} placeholder={'max'}/>
                            </div>
                        </Field>

                    </Field>
                </div>

                <PrimaryButton
                    className={'mx-auto sticky hover:shadow-sm bottom-0 border-4 dark:border-neutral-800 border-white'}
                    size={'lg'} icon={faSearch} onClick={submit}
                    processing={!isLoaded}>{lang('Search')}</PrimaryButton>
            </form>
        </div>
    </div>;

}
