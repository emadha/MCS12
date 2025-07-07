/*
  todo make the form more intuitive, search car make by 'volkswagen gti 2015' for example.
 */
import TextInput from '@/Components/Form/TextInput'
import Field from '@/Components/Form/Field'
import { faDollar, faExclamationTriangle, faMultiply, faSpinner, faUpload } from '@fortawesome/free-solid-svg-icons'
import { Head, useForm, usePage } from '@inertiajs/react'
import Select from '@/Components/Form/Select'
import InputLabel from '@/Components/Form/InputLabel'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '@/AppContext'
import { Tab, Transition } from '@headlessui/react'
import StepButton from '@/Pages/Listing/Cars/Form/Steps/StepButton'
import StepContent from '@/Pages/Listing/Cars/Form/Steps/StepContent'
import MyShowroomSelect from '@/Components/User/Widgets/ShowroomSelect'
import { Checkbox } from 'antd'
import { CarFormContext } from '@/Context/CarFormContext'
import Alert from '@/Components/Alerts/Alert'
import UploadDropzone from '@/Components/Form/UploadDropzone'
import TextArea from '@/Components/Form/TextArea'
import { isArray, isInteger, range } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InputError from '@/Components/Form/InputError'
import GooglePlacesInput from '@/Components/GooglePlacesInput'
import SkeletonImage from 'antd/es/skeleton/Image'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import ListingItemCarBlock from '@/Components/Listing/ListingItemCarBlock'
import toast from 'react-hot-toast'
import PageContainer from '@/Layouts/PageContainer'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import Contacts from '@/Components/Contacts'

export default function Form ({ title, item, cost, contactMethods = [], settings, max_filesize = '0' }) {

    const IGNORE_STEPS_ERRORS = false
    const STEP_PHOTOS = 0
    const STEP_MAKE = 1
    const STEP_DETAILS = 2
    const STEP_DESCRIPTION = 3
    const STEP_LOCATION = 4
    /*  Reason why it's stepConfirm and not STEP_CONFIRM is that i need to change the step number
        when the item belongs to a showroom => removes location tab.
     */
    const [stepConfirm, setStepConfirm] = useState(5)
    const [stepMax, setStepMax] = useState(5)
    const MAX_FILES = settings.listing?.photos?.max?.free || 4
    const MIN_FILES = 3

    const [isLoaded, setIsLoaded] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submittedItem, setSubmittedItem] = useState(false)
    const [showSubmittedItem, setShowSubmittedItem] = useState(false)

    const { user } = usePage().props.auth
    const urlParams = new URLSearchParams(window.location.search)

    const {
        api, lang, pageLocale, setHasSidebar, getCarMakes, getCarMakesModels, getCarMakesModelsSeries, getCarMakesModelsSeriesTrims, rtl,
    } = useContext(AppContext)

    const {
        post, processing, data, setData, reset, isDirty, errors, hasErrors, clearErrors, setError,
    } = useForm({
        type: 'car', description: item?.description ?? '', year: null, make: null, model: null, series: null, trim: null,
        exterior_color: item?.item.exterior_color ?? null, interior_color: item?.item.interior_color ?? null, interior_material: item?.item.interior_material ?? null,
        condition: item?.condition ?? null, currency: item?.currency ?? settings.currencies.current, price: item?.price ?? null, odometer: item?.item.odometer ?? 0, vin: item?.item.vin ??
            null,
        showroom: urlParams.get('shop') ?? null, photos: item?.photos, location: item?.location ?? null,
    })

    const [message, setMessage] = useState({ status: 0, message: [] })

    const [searchDefaultFields, setSearchDefaultFields] = useState({
        year: { min: 1942, max: 2024 }, locations: [], makes: [], exterior_color: null, interior_color: null, interior_material: null, condition: null, price: 123, currency: settings.currencies.current, odometer: null, vin: '', description: null,
    })

    const LANG_PHOTOS = lang('Photos')

    const createStepsObject = () => [
        {
            title: lang('Photos'), description: `Add up to  ${MAX_FILES} photos for your car.`, errors: [], isActive: true, isPrimary: true,
        }, {
            title: lang('Select', ' ', 'Make'), description: lang('Select Car you wish to sell'), errors: [], isActive: false,
        }, {
            title: lang('Details'), description: 'Fill up the car details', errors: [], isActive: false,
        }, {
            title: lang('Description'), description: lang('Enter a description', '...'), errors: [], isActive: false,
        }, {
            title: lang('Contact & Location'), description: 'Select location', errors: [], isActive: false,
        }, {
            title: lang('Confirm'), description: 'Confirm', errors: [], isActive: false, isValid: true,
        },
    ]
    const DEFAULT_YEAR = 2015

    const [stepsObject, setStepsObject] = useState(createStepsObject)
    const [allSteps, setAllSteps] = useState(stepsObject)
    const [position, setPosition] = useState(null)
    const [geoLocation, setGeoLocation] = useState([])
    const [geoLocationMessage, setGeoLocationMessage] = useState('')
    const [currentRegion, setCurrentRegion] = useState(settings.regions.current)
    const [location, setLocation] = useState(item?.location)
    const [selectedContactMethods, setSelectedContactMethods] = useState(item?.contact ?? [])
    const [files, setFiles] = useState(item?.photos ?? [])

    const [loadingGeoLocation, setLoadingGeoLocation] = useState(false)
    const [carMakesList, setCarMakesList] = useState([])
    const [carModelsList, setCarModelsList] = useState([])
    const [carSeriesList, setCarSeriesList] = useState([])
    const [carTrimsList, setCarTrimsList] = useState([])

    const [selectedCarId, setSelectedCarId] = useState(null)
    const [carYearsList, setCarYearsList] = useState(range(1942, new Date().getFullYear()).map(e => {
        return { label: e, value: e }
    }))
    const [selectedCarYear, setSelectedCarYear] = useState({ label: DEFAULT_YEAR, value: DEFAULT_YEAR, option: {} })
    const [selectedCarMake, setSelectedCarMake] = useState(null)
    const [selectedCarModel, setSelectedCarModel] = useState(null)
    const [selectedCarSeries, setSelectedCarSeries] = useState(null)
    const [selectedCarTrim, setSelectedCarTrim] = useState(null)

    const [belongsToShowroom, setBelongsToShowroom] = useState(false)
    const [usedShowroom, setUsedShowroom] = useState({ option: { label: urlParams.get('shop') } })

    const [selectedCurrency, setSelectedCurrency] = useState(data.currency)
    const [selectedPrice, setSelectedPrice] = useState(data.price)
    const [selectedExteriorColor, setSelectedExteriorColor] = useState(data.exterior_color)
    const [selectedInteriorColor, setSelectedInteriorColor] = useState(data.interior_color)
    const [selectedInteriorMaterial, setSelectedInteriorMaterial] = useState(data.interior_material)
    const [selectedCondition, setSelectedCondition] = useState(data.condition)
    const [selectedVIN, setSelectedVIN] = useState(data.vin)
    const [selectedOdometer, setSelectedOdometer] = useState(data.odometer)

    const getSearchDefaultFields = () => {
        axios.post(route('api.search.defaults')).then(r => {
            setSearchDefaultFields({ ...searchDefaultFields, ...r.data })
        })
    }

    useEffect(() => {
        let filledContacts = selectedContactMethods.filter(f => f && f.value)
        setData('contacts', filledContacts)
    }, [selectedContactMethods])

    useEffect(() => {
        axios.get(route('my.showrooms.details', { showroom_id: urlParams.get('shop') })).then(res => {
            if (res?.data?.id) {
                setBelongsToShowroom(true)
                setUsedShowroom(() => {
                    return { option: { value: res.data.id, label: res.data.title } }
                })
            }
        })

        getSearchDefaultFields()
        setHasSidebar(false)
    }, [])

    // recreate stepsObject on locale change
    // cuz the titles langs change
    useEffect(() => setStepsObject(createStepsObject), [pageLocale])
    useEffect(() => {
        if (belongsToShowroom === true) {
            setStepsObject(stepsObject.filter(e => e.title !== lang('Location')))
            setStepMax(4)
            setStepConfirm(4)
        } else {
            setStepsObject(allSteps)
            setStepMax(5)
            setStepConfirm(5)
            setUsedShowroom(null)
        }

    }, [belongsToShowroom])
    useEffect(() => {
        setData('showroom', usedShowroom?.option?.value || null)
    }, [usedShowroom])

    useEffect(() => {
        setCarMakesList([])
        setSelectedCarMake(null)

        if (selectedCarYear?.value) {
            getCarMakes(selectedCarYear.value).
                then(res => setCarMakesList(res.data.map(e => {
                    return { label: e.make, value: e.make_slug }
                })))
        }

    }, [selectedCarYear])
    useEffect(() => {
        setCarModelsList([])
        setSelectedCarModel(null)

        if (selectedCarMake) {
            getCarMakesModels(selectedCarMake?.value).
                then(res => {
                    setCarModelsList(res.data.map(e => {
                        return { label: e.model, value: e.model_slug }
                    }))
                })
        }

    }, [selectedCarMake])
    useEffect(() => {
        setCarSeriesList([])
        setSelectedCarSeries(null)

        selectedCarMake && selectedCarModel && getCarMakesModelsSeries(selectedCarMake?.value, selectedCarModel?.value).
            then(res => {
                setCarSeriesList(res.data.map(e => {
                    return { label: e.series, value: e.series_slug }
                }))
                setSelectedCarSeries(null)
            })

    }, [selectedCarModel])
    useEffect(() => {
        setCarTrimsList([])
        setSelectedCarTrim(null)

        selectedCarMake && selectedCarModel && selectedCarSeries && getCarMakesModelsSeriesTrims(selectedCarMake?.value, selectedCarModel?.value, selectedCarSeries?.value).
            then(res => {
                setCarTrimsList(res.data.map(e => {
                    return { label: e.trim, value: e.trim_slug }
                }))

            })

    }, [selectedCarSeries])
    useEffect(() => {
    }, [selectedCarTrim])
    useEffect(() => {
        setData('photos', files.filter(filter => filter.success === 1).map(file => file.id))
    }, [files])

    const submit = async (e) => {
        e.preventDefault()
        let _url = item?.id ? route('listing.single.store', item.id) : route('listing.cars.store')
        post(_url, {
            preserveScroll: true, preserveState: true, onStart: () => {
                setIsSubmitting(true)
                setMessage({ status: 0, message: null })
                setSubmittedItem(false)
                setShowSubmittedItem(false)
            }, onSuccess: (page) => {
                if (page.props?.flash?.message[0]?.status === 1) {
                    setMessage({ status: 1, message: page.props.flash.message[0].message })
                    setSubmittedItem(<ListingItemCarBlock item={page.props.flash.message[0].item.data} itemsView={'list'}/>)
                    setShowSubmittedItem(true)
                } else {
                    setMessage({ status: 1, message: 'Success but could not display results.' })
                }
            },

            onError: (e) => {

                setMessage(() => {
                    toast.error(Object.values(e).join('\n'), { position: 'bottom-left' })
                    return { status: -1, message: Object.values(e) }
                })

                console.warn('Error submitting', e)
            }, onFinish: () => {
                setIsSubmitting(false)
            },
        })
    }
    useEffect(() => {
        errors && Object.values(errors)?.filter(e => e).length && toast.error(Object.values(errors).join('\n'), {
            position: 'bottom-left', icon: '😕',
        })
    }, [errors])

    const verifyStep = () => {
        setStepError(currentStep, [])
        setStepValid(currentStep, false)
        switch (currentStep) {
            case STEP_MAKE : {
                clearErrors('make', 'model', 'series', 'trim', 'year')
                if (selectedCarMake && selectedCarModel && selectedCarSeries && selectedCarTrim && selectedCarYear) {
                    setStepValid(currentStep)
                    return true
                } else {
                    let missedItems = []

                    if (!selectedCarYear) {
                        missedItems.push([lang('Year')])
                        setError('year', 'Car Year is required')
                    } else if (selectedCarYear && selectedCarYear > new Date().getFullYear()) {
                        missedItems.push([lang('Year')])
                        setError('year', 'Car Year cannot be higher than current year')
                    }

                    if (!selectedCarMake) {
                        missedItems.push([lang('Make')])
                        setError('make', 'Make is required')
                    }

                    if (!selectedCarModel) {
                        missedItems.push([lang('Model')])
                        setError('model', 'Model is required')
                    }
                    if (!selectedCarSeries) {
                        missedItems.push([lang('Series')])
                        setError('series', 'Series is required')
                    }
                    if (!selectedCarTrim) {
                        missedItems.push([lang('Trim')])
                        setError('trim', 'Trim is required')
                    }

                    setStepError(STEP_MAKE, [
                        {
                            title: lang('Some Information Missing', '...'), description: lang('You need to select', ': ') + '<strong>' +
                                missedItems.join(lang('</strong>', ',', '<strong>', ' ')),
                        },
                    ])
                }

                return stepsObject[STEP_MAKE].isValid
            }
            case STEP_DESCRIPTION: {
                clearErrors('description')
                if (data.description?.length) {
                    setStepValid(STEP_DESCRIPTION)
                    return true
                } else {
                    setStepError(STEP_DESCRIPTION, [{ description: lang('Description cannot be empty') }])
                    setError('description', 'Description is required')
                    setStepValid(STEP_DESCRIPTION, false)
                    return false
                }
            }
            case STEP_DETAILS: {
                clearErrors('currency', 'price', 'exterior_color', 'interior_color', 'interior_material', 'condition', 'odometer', 'showroom')
                if (selectedCurrency !== null && (isInteger(parseInt(selectedPrice))) && selectedExteriorColor != null && selectedInteriorColor != null && selectedInteriorMaterial != null &&
                    selectedCondition != null && (isInteger(parseInt(selectedOdometer))) && (belongsToShowroom ? usedShowroom : true)) {
                    setStepError(STEP_DETAILS, [])
                    setStepValid(STEP_DETAILS)
                } else {
                    let missedItems = []

                    if (selectedCurrency == null) {
                        missedItems.push([lang('Currency')])
                        setError('currency', 'Currency is required')
                    }

                    if (!(isInteger(parseInt(selectedPrice)))) {
                        missedItems.push([lang('Price')])
                        setError('price', 'Price is required')
                    }

                    if (selectedExteriorColor == null) {
                        missedItems.push([lang('Exterior Color')])
                        setError('exterior_color', 'Exterior Color is required')
                    }

                    if (selectedInteriorColor == null) {
                        missedItems.push([lang('Interior Color')])
                        setError('interior_color', 'Interior Color is required')
                    }

                    if (selectedInteriorMaterial == null) {
                        missedItems.push([lang('Interior Material')])
                        setError('interior_material', 'Interior Material is required')
                    }

                    if (selectedCondition == null) {
                        missedItems.push([lang('Condition')])
                        setError('condition', 'Condition is required')
                    }

                    if (!(isInteger(parseInt(selectedOdometer)))) {
                        missedItems.push([lang('Odometer')])
                        setError('odometer', 'Odometer is required')
                    }

                    if (belongsToShowroom && !usedShowroom) {
                        missedItems.push([lang('Showroom')])
                        setError('showroom', 'You need to select a showrooom.')
                    }

                    setStepError(STEP_DETAILS, [
                        {
                            title: lang('Some Information Missing'), description: lang('You need to fill up the required input.'),
                        }, { description: missedItems.join(lang(',') + ' ') },
                    ])

                    setStepError(STEP_DETAILS, [
                        {
                            title: lang('Some Information Missing'), description: lang('You need to fill up the required input.'),
                        }, { description: missedItems.join(lang(',') + ' ') },
                    ])

                    return false
                }

                return true
            }
            case STEP_LOCATION: {

                setStepValid(currentStep)

                if (!belongsToShowroom && !location) {
                    setStepValid(currentStep, false)
                    setStepError(STEP_LOCATION, [
                        {
                            title: 'Location is required', description: 'Location is required if this car does not belong to a showroom.',
                        },
                    ])
                    return false
                }
                return true
                break
            }
            case STEP_PHOTOS: {

                if (files.filter(file => file.success).length < MIN_FILES) {
                    setStepError(STEP_PHOTOS, [
                        {
                            title: lang('Upload some photos first'), description: lang('You need to select at least ' + MIN_FILES + ' photos to continue.'),
                        },
                    ])
                    setStepValid(currentStep, false)
                    setError('photos', lang('You need at least 3 photos.'))
                    window.scrollTo({ top: 0, behavior: 'smooth' })

                    return false
                }
                setStepError(STEP_PHOTOS, [])
                setError('photos', null)

                setStepValid(currentStep)
                return true

            }
            default:
                return true
        }
    }
    const setStepError = (step, errors = []) => {
        setError(step, '')
        setStepsObject(previousSteps => {
            previousSteps[step].errors = errors
            return previousSteps
        })
    }
    const setStepValid = (step, valid = true) => {
        stepsObject[step].isValid = valid

        setStepsObject(previousStep => {
            return [...stepsObject]
        })

    }
    const [currentStep, setCurrentStep] = useState(0)
    const selectStep = (step) => {
        setCurrentStep(currentStepPrev => {
            setStepsObject(prev => {
                let stepsModified = stepsObject.map((o, key) => {
                    return { ...o, isActive: step == key ? true : false }
                })
                return stepsModified
            })
            return step
        })
    }
    const nextStep = () => {
        clearErrors()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        if (verifyStep()) {
            setTimeout(e => {
                selectStep(currentStep >= stepsObject.length ? currentStep : currentStep + 1)
                setIsLoaded(true)
            }, 200)

        } else {
            return false
        }

    }
    const previousStep = () => {
        setIsLoaded(false)
        clearErrors()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => {
            selectStep(currentStep < 0 ? 0 : currentStep - 1)
            setIsLoaded(true)
        }, 200)

    }
    const StepConfirmTableRow = ({ title, value = '', htmlValue, error, onErrorClick }) => <>
        <tr className={'odd:bg-neutral-100 even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800'}>
            <td className={'p-2 w-1/2 text-neutral-500 ' + (rtl ? 'text-left' : 'text-right')}>
                <p>{title}</p>
                {error ? <span
                    className={'inline-block transition-all bg-orange-800 text-white cursor-pointer py-0.5 px-2 rounded text-xs'}
                    onClick={onErrorClick}>
              {lang(error)}
                    <FontAwesomeIcon className={'ml-1 text-orange-700'} icon={faExclamationTriangle}/>
            </span> : <></>}
            </td>
            {htmlValue
                ? <td className={'p-2 w-1/2 font-black ' + (rtl ? 'text-right' : 'text-left')}
                      dangerouslySetInnerHTML={{ __html: htmlValue.replace(/(?:\r\n|\r|\n)/g, '<br>') }}/> : <td
                    className={'p-2 w-1/2 font-black ' + (rtl ? 'text-right' : 'text-left')}>{!htmlValue && value}</td>}

        </tr>
    </>
    const _reset = () => {
        reset()
    }
    const successfulFiles = (files.length && files.filter(file => file.success)) || []

    const handleOdometerChange = (e) => {
        setSelectedOdometer(e.target.value)
        setData('odometer', e.target.value)
    }
    const uploadRef = useRef()

    return <div className={'relative'}>
        <form onSubmit={submit} className={' mx-auto relative'}>
            {false && <div
                className={'lg:sticky top-20 py-3  bg-white/60 dark:bg-neutral-900/70 backdrop-blur-xl z-10 flex justify-center items-center '}>
                <Tab.Group onChange={e => selectStep(e)}>
                    <Tab.List
                        className={'w-full max-w-4xl items-stretch flex flex-wrap justify-around'}>
                        <div
                            className={'text-xl font-black sm:w-2/12 w-full my-5 text-center sm:text-right px-3 dark:text-neutral-200/10 text-neutral-200 select-none'}>
                            {lang('Welcome')}
                        </div>
                        <div className={'flex flex-wrap justify-center gap-y-2'}>{stepsObject && stepsObject.length &&
                            stepsObject.filter((f, i) => !(belongsToShowroom && i === STEP_LOCATION)).map((stepObject, key) =>
                                <StepButton key={key} step={stepObject} disabled={processing}>
                                    {stepObject.title}
                                </StepButton>)
                        }</div>
                    </Tab.List>
                </Tab.Group>
            </div>}
            <div className={'pb-20 duration-1000 min-h-[calc(70vh)]'}>
                <CarFormContext.Provider value={{
                    currentStep: currentStep, setCurrentStep: setCurrentStep, nextStep: nextStep, previousStep: previousStep, maxSteps: stepMax, setStepMax: setStepMax, processing: processing, stepsObject: stepsObject, setStepsObject: setStepsObject, verifyStep: verifyStep, isDirty: isDirty, reset: _reset, isLoaded: isLoaded, setStepError: setStepError,
                }}>
                    <PageContainer title={lang(stepsObject[currentStep].title)} className={' transition-all min-h-[70vh] !max-w-4xl relative p-5'}>
                        <Head title={lang(stepsObject[currentStep].title)}/>
                        {!isSubmitting ? <div className={'relative transition-all'}>
                            {item?.id ? <h2 className={'text-center container'}>Editing : Item#{item?.id}</h2> : <></>}
                            <StepContent step={STEP_PHOTOS} showHeading={false} withButtons={<>
                                {files.length ? <>
                                    <SecondaryButton
                                        icon={faMultiply}
                                        onClick={() => setFiles([]) || setStepError(STEP_PHOTOS, [])}>
                                        {lang('Clear all photos')}
                                    </SecondaryButton>
                                </> : <></>}
                                <SecondaryButton
                                    icon={faUpload}
                                    onClick={() => uploadRef?.current.click()}>
                                    {lang('Upload')}
                                </SecondaryButton>
                            </>}>
                                <UploadDropzone uploadRef={uploadRef}
                                                currentStep={currentStep}
                                                clearErrors={clearErrors} setStepError={setStepError} files={files} maxFileSize={max_filesize} setFiles={setFiles}
                                                MAX_FILES={MAX_FILES} setData={setData} data={data}/>
                            </StepContent>
                            <StepContent step={STEP_MAKE}>
                                <div className={'lg:flex justify-between gap-x-5 '}>
                                    <div className={'lg:w-1/2'}>
                                        <InputLabel className={'text-left'}>{lang('Select', ' ', 'Year')}</InputLabel>
                                        <Select options={carYearsList}
                                                name={'year'}
                                                defaultValue={DEFAULT_YEAR}
                                                placeholder={lang('Year')}
                                                handleOnChange={e => {
                                                    setSelectedCarYear(e)
                                                    setData('year', e.value)
                                                }}/>
                                        {errors.year && <InputError className={'py-2'} message={errors.year}/>}
                                    </div>
                                    <div className={'lg:w-1/2'}>
                                        <InputLabel>{lang('Select', ' ', 'Make')}</InputLabel>
                                        <Select options={carMakesList}
                                                name={'make'}
                                                defaultValue={selectedCarMake}
                                                disabled={(!carMakesList || !selectedCarYear)}
                                                placeholder={lang('Make')}
                                                handleOnChange={e => {
                                                    setSelectedCarMake(e) || setData('make', e.value)
                                                }}/>
                                        {errors.make && <InputError className={'py-2'} message={errors.make}/>}
                                    </div>
                                </div>
                                <div>
                                    <InputLabel>{lang('Select', ' ', 'Model')}</InputLabel>
                                    <Select options={carModelsList}
                                            name={'model'}
                                            disabled={!selectedCarMake}
                                            defaultValue={selectedCarModel}
                                            placeholder={lang('Model')}
                                            handleOnChange={e => setSelectedCarModel(e) || setData('model', e.value)}/>
                                    {errors.model && <InputError className={'py-2'} message={errors.model}/>}
                                </div>
                                <div>
                                    <InputLabel>Select Series</InputLabel>
                                    <Select options={carSeriesList}
                                            name={'series'}
                                            defaultValue={selectedCarSeries}
                                            disabled={!selectedCarModel}
                                            placeholder={lang('Series')}
                                            handleOnChange={e => setSelectedCarSeries(e) || setData('series', e.value)}/>
                                    {errors.series && <InputError className={'py-2'} message={errors.series}/>}
                                </div>
                                <div>
                                    <InputLabel>Select Trim</InputLabel>
                                    <Select options={carTrimsList}
                                            name={'trim'}
                                            defaultValue={selectedCarTrim}
                                            disabled={!selectedCarSeries}
                                            placeholder={lang('Trim')}
                                            handleOnChange={e => setSelectedCarTrim(e) || setData('trim', e.value)}/>
                                    {errors.trim && <InputError className={'py-2'} message={errors.trim}/>}
                                </div>
                            </StepContent>
                            <StepContent step={STEP_DESCRIPTION}>
                                <TextArea placeholder={stepsObject[STEP_DESCRIPTION].description}
                                          name={'description'}
                                          rows={7}
                                          hasError={errors.description}
                                          defaultValue={data.description}
                                          handleChange={e => setData('description', e.target.value)}/>
                            </StepContent>
                            <StepContent step={STEP_DETAILS}>
                                <div className={'text-left rtl:text-right flex flex-wrap items-start justify-start'}>

                                    <div className={'sm:w-1/2 w-full sm:rtl:pl-5 sm:pr-5 sm:rtl:pr-0'}>
                                        <Field>
                                            <InputLabel className={'w-full'}>{lang('Price')}</InputLabel>
                                            <div className={'flex sm:flex-nowrap flex-wrap gap-2 w-full'}>
                                                <Select options={searchDefaultFields.currency}
                                                        name={'currency'}
                                                        clearable={false}
                                                        className={'w-full sm:w-1/3 ' + (errors.currency ? ' !border !border-red-500' : '')}
                                                        inputClassName={'ring-'}
                                                        defaultValue={selectedCurrency}
                                                        disabled={!isLoaded}
                                                        leftIcon={faDollar}
                                                        handleOnChange={e => setSelectedCurrency(e?.value) || setData('currency', e?.value)}/>
                                                <TextInput type={'number'} placeholder={lang('Price')}
                                                           className={'w-full sm:w-2/3'}
                                                           name={'price'}
                                                           defaultValue={selectedPrice}
                                                           disabled={!isLoaded}
                                                           hasError={errors.price}
                                                           handleChange={e => setSelectedPrice(e.target.value) || setData('price', e.target.value)}/>
                                            </div>
                                        </Field>
                                        <Field>
                                            <InputLabel>{lang('Exterior Color')}</InputLabel>
                                            <Select options={searchDefaultFields.exterior_color?.filter(f => f.value)}
                                                    name={'exterior_color'}
                                                    defaultValue={selectedExteriorColor}
                                                    disabled={!isLoaded}
                                                    placeholder={lang('Select')}
                                                    clearable={false}
                                                    hasError={errors.exterior_color}
                                                    handleOnChange={e => setSelectedExteriorColor(e?.value) || setData('exterior_color', e?.value)}/>
                                        </Field>
                                        <Field>
                                            <InputLabel>{lang('Interior Color')}</InputLabel>
                                            <Select options={searchDefaultFields.interior_color?.filter(f => f.value)}
                                                    name={'interior_color'}
                                                    defaultValue={selectedInteriorColor}
                                                    clearable={false}
                                                    disabled={!isLoaded}
                                                    placeholder={lang('Select')}
                                                    hasError={errors.interior_color}
                                                    handleOnChange={e => setSelectedInteriorColor(e?.value) || setData('interior_color', e?.value)}/>
                                        </Field>
                                        <Field>
                                            <InputLabel>{lang('Interior Material')}</InputLabel>
                                            <Select options={searchDefaultFields.interior_material?.filter(f => f.value)}
                                                    name={'interior_material'}
                                                    clearable={false}
                                                    defaultValue={selectedInteriorMaterial}
                                                    placeholder={lang('Select')}
                                                    disabled={!isLoaded}
                                                    hasError={errors.interior_material}
                                                    handleOnChange={e => setSelectedInteriorMaterial(e?.value) || setData('interior_material', e?.value)}/>
                                        </Field>
                                        <Field>
                                            <InputLabel>{lang('Condition')}</InputLabel>
                                            <Select options={searchDefaultFields.conditions?.filter(f => f.value)}
                                                    name={'condition'}
                                                    clearable={false}
                                                    defaultValue={selectedCondition}
                                                    placeholder={lang('Condition')}
                                                    disabled={!isLoaded}
                                                    hasError={errors.condition}
                                                    handleOnChange={e => setSelectedCondition(e?.value) || setData('condition', e?.value)}/>
                                        </Field>
                                    </div>
                                    <div className={'sm:w-1/2 w-full'}>

                                        <Field>
                                            <InputLabel>{lang('Odometer')}</InputLabel>
                                            <TextInput type={'number'} placeholder={lang('Odometer')}
                                                       name={'odometer'}
                                                       defaultValue={selectedOdometer}
                                                       disabled={!isLoaded}
                                                       hasError={errors.odometer}
                                                       keepPositiveIfNumeric={true}
                                                       handleChange={e => handleOdometerChange(e)}/>
                                        </Field>

                                        <Field>
                                            <InputLabel>{lang('VIN')}</InputLabel>
                                            <TextInput type={'text'}
                                                       name={'vin'}
                                                       max={17}
                                                       placeholder={lang('VIN')}
                                                       hasError={errors.vin}
                                                       defaultValue={selectedVIN}
                                                       disabled={!isLoaded}
                                                       handleChange={e => setSelectedVIN(e.target.value) || setData('vin', e.target.value)}/>
                                        </Field>

                                        <div className={'py-5'}>
                                            <Checkbox className={'text-neutral-800 dark:text-white'}
                                                      checked={belongsToShowroom}
                                                      defaultChecked={urlParams.get('shop') ? true : false}
                                                      value={belongsToShowroom}
                                                      disabled={!isLoaded}
                                                      rootClassName={''}
                                                      onChange={e => setBelongsToShowroom(e.target.checked)}>
                                                {lang('Does this car belong to one of your showrooms?')}
                                                <small className={'block text-gray-600 dark:text-gray-500'}>
                                                    {lang('If checked, address and contact details will be taken from the showroom details')}
                                                </small>
                                            </Checkbox>
                                        </div>
                                        <div className={'p-5 ' + (belongsToShowroom ? 'h-32 opacity-100' : ' opacity-0 h-0 overflow-hidden ')}>
                                            <Transition
                                                className={'w-full flex absolutes items-start justify-start'}
                                                enter={'duration-300'}
                                                enterFrom={'scale-90 opacity-0'}
                                                leave={'duration-300'}
                                                leaveTo={'scale-90 opacity-0'}
                                                show={belongsToShowroom}>
                                            </Transition>
                                            <Transition
                                                className={'w-full ease-in flex mt-5 items-center justify-start'}
                                                enter={'duration-300'}
                                                enterFrom={'scale-90 opacity-0'}
                                                leave={'duration-300'}
                                                leaveTo={'scale-90 opacity-0'}
                                                show={belongsToShowroom}>
                                                <MyShowroomSelect
                                                    name={'showroom'}
                                                    hasError={errors.showroom}
                                                    defaultValue={usedShowroom?.option?.value}
                                                    selectedShowRoom={usedShowroom}
                                                    onChange={e => setUsedShowroom(e) || setData('showroom', e?.value)}/>
                                            </Transition>

                                        </div>
                                    </div>
                                </div>
                            </StepContent>
                            {!belongsToShowroom && <StepContent showHeading={false} step={STEP_LOCATION}>
                                <>
                                    <h3>{lang('Select Location')}</h3>
                                    {Object.values(searchDefaultFields.locations).length ? <>
                                        <div
                                            className={'sm:flex flex-nowrap sm:flex-wrap justify-start w-full mx-auto mt-10 p-10 dark:bg-neutral-800/50 rounded'}>
                                            {Object.values(searchDefaultFields.locations).map((loc, k) => <div
                                                className={'sm:w-1/3 w-full mx-auto max-w-xs text-center sm:text-left rtl:sm:text-right rounded dark:hover:bg-neutral-700' +
                                                    ' hover:bg-lime-600/10 transition-all cursor-pointer py-2 inline-block ' + (location == loc.id ? ' !bg-lime-600 !text-white' : '')}
                                                onClick={e => setLocation(loc.id) || setData('location', loc.id)}
                                            >
                                                <FontAwesomeIcon icon={faCheckCircle} className={'mx-2 ' + (location === loc.id ? 'opacity-100 animate-pop-in-lg' : 'opacity-0')}/>
                                                <span>{loc.name.length ? lang(loc.name) : searchDefaultFields.locations[0].name}</span>
                                            </div>)}

                                        </div>
                                    </> : <><GooglePlacesInput/></>}
                                    <div>
                                        <div className={'mb-2 select-none'}>
                                            <h3>{lang('Select a contact method')}</h3>
                                            <small>An interested viewer may want to contact you, please provide a contact method below</small></div>
                                        <Contacts
                                            allowedContactMethods={contactMethods}
                                            rootSelectedContactMethods={selectedContactMethods}
                                            rootSetSelectedContactMethods={setSelectedContactMethods}
                                        />
                                    </div>
                                </>
                            </StepContent>}
                            <StepContent showHeading={false} step={stepConfirm} isFinal={submittedItem} onSubmit={() => clearErrors()}>

                                <Transition show={!showSubmittedItem}
                                            enter={'h-2 duration-100 overflow-hidden'}
                                            enterFrom={'h-0'}
                                            enterTo={'h-auto'}
                                            leave={'duration-100'}
                                            leaveFrom={'h-10'}
                                            leaveTo={'h-0'}>
                                    <div className={'mx-auto max-w-3xl text-md'}>

                                        <p dangerouslySetInnerHTML={{ __html: lang('CONFIRM_MSG') }}/>
                                        <table className={'table my-10 w-full bg-neutral-50'}>
                                            <tbody className={''}>

                                            <tr className={'bg-white dark:bg-black'}>
                                                <td colSpan={2} className={'p-2 dark:bg-neutral-900 text-center'}>
                                                    <div className={'flex gap-2 flex-wrap w-full justify-center items-center'}>
                                                        {successfulFiles.length >= MIN_FILES ? successfulFiles.map(file => <img
                                                            className={'w-24 aspect-square object-cover bg-white rounded animate-pop-in-lg'}
                                                            src={file.preview}/>) : <>
                                                            <SkeletonImage className={'animate-pulse'} active={true}/>
                                                            <SkeletonImage className={'animate-pulse'} active={true}/>
                                                            <SkeletonImage className={'animate-pulse'} active={true}/>
                                                        </>}
                                                    </div>
                                                </td>
                                            </tr>

                                            <StepConfirmTableRow title={lang('Description')}
                                                                 error={errors.description}
                                                                 onErrorClick={() => selectStep(STEP_DESCRIPTION)}
                                                                 htmlValue={data.description || '-'}/>

                                            <StepConfirmTableRow title={lang('Year')}
                                                                 error={errors.year}
                                                                 onErrorClick={() => selectStep(STEP_MAKE)}
                                                                 value={selectedCarYear?.option.label || '-'}/>

                                            <StepConfirmTableRow title={lang('Make')}
                                                                 error={errors.make}
                                                                 onErrorClick={() => selectStep(STEP_MAKE)}
                                                                 value={selectedCarMake?.option.label || '-'}/>

                                            <StepConfirmTableRow title={lang('Model')}
                                                                 error={errors.model}
                                                                 onErrorClick={() => selectStep(STEP_MAKE)}
                                                                 value={selectedCarModel?.option.label || '-'}/>

                                            <StepConfirmTableRow title={lang('Series')}
                                                                 error={errors.series}
                                                                 onErrorClick={() => selectStep(STEP_MAKE)}
                                                                 value={selectedCarSeries?.option.label || '-'}/>

                                            <StepConfirmTableRow title={lang('Trim')}
                                                                 error={errors.trim}
                                                                 onErrorClick={() => selectStep(STEP_MAKE)}
                                                                 value={selectedCarTrim?.option.label || '-'}/>

                                            {isLoaded && searchDefaultFields.exterior_color && selectedExteriorColor && <StepConfirmTableRow
                                                title={lang('Exterior Color')}
                                                error={errors.exterior_color}
                                                onErrorClick={() => selectStep(STEP_DETAILS)}
                                                value={selectedExteriorColor !== null ? searchDefaultFields?.exterior_color[selectedExteriorColor]?.label ?? '-' : '.'}/>}

                                            {isLoaded && searchDefaultFields.interior_color && selectedInteriorColor && <StepConfirmTableRow
                                                title={lang('Interior Color')}
                                                error={errors.interior_color}
                                                onErrorClick={() => selectStep(STEP_DETAILS)}
                                                value={selectedInteriorColor !== null ? searchDefaultFields?.interior_color[selectedInteriorColor]?.label ?? '-' : '.'}/>}

                                            {isLoaded && searchDefaultFields.interior_color && selectedInteriorMaterial && <StepConfirmTableRow
                                                title={lang('Interior Material')}
                                                error={errors.interior_material}
                                                onErrorClick={() => selectStep(STEP_DETAILS)}
                                                value={selectedInteriorMaterial !== null ? searchDefaultFields?.interior_material[selectedInteriorMaterial]?.label ?? '-' : '.'}/>}

                                            {isLoaded && searchDefaultFields.condition && selectedCondition && <StepConfirmTableRow
                                                title={lang('Condition')}
                                                error={errors.condition}
                                                onErrorClick={() => selectStep(STEP_DETAILS)}
                                                value={selectedCondition !== null ? searchDefaultFields?.conditions[selectedCondition]?.label ?? '-' : '.'}/>}

                                            <StepConfirmTableRow title={lang('Price')}
                                                                 error={errors.price}
                                                                 onErrorClick={() => selectStep(STEP_DETAILS)}
                                                                 value={selectedPrice ? selectedPrice + ' ' + settings.currencies.list[selectedCurrency] : '-'}/>

                                            <StepConfirmTableRow title={lang('Odometer')}
                                                                 error={errors.odometer}
                                                                 onErrorClick={() => selectStep(STEP_DETAILS)}
                                                                 value={selectedOdometer ?? '-'}/>

                                            <StepConfirmTableRow title={lang('VIN')}
                                                                 value={selectedVIN ?? '-'}/>

                                            <StepConfirmTableRow title={lang('Location')}
                                                                 onErrorClick={() => selectStep(STEP_LOCATION)}
                                                                 error={errors.location}
                                                                 value={usedShowroom ? 'Taken from showroom location' : searchDefaultFields.locations.filter(
                                                                     l => l.id === (location ?? 0))[0]?.name ?? '_'}/>


                                            <StepConfirmTableRow title={lang('Contact Method')} htmlValue={
                                                selectedContactMethods && isArray(selectedContactMethods)
                                                && selectedContactMethods.length ? selectedContactMethods.map(
                                                    e => e.method + ':\t' + e.value).join('\n') : '-'
                                            }/>

                                            {belongsToShowroom ? <StepConfirmTableRow title={lang('Does this car belong to one of your showrooms?')}
                                                                                      error={errors.showroom}
                                                                                      value={usedShowroom ? <p dir={rtl ? 'rtl' : 'ltr'}>
                                                                                          {lang('Yes', ',', ' ', 'to', ' ')}
                                                                                          <strong className={'text-sky-500'}>
                                                                                              {usedShowroom?.option?.label}
                                                                                          </strong>
                                                                                      </p> : <>{lang('No')}</>}/> : <></>}
                                            </tbody>
                                        </table>
                                    </div>
                                </Transition>
                                <Transition show={showSubmittedItem}
                                            enter={'duration-500'}
                                            enterFrom={'opacity-0'}
                                            enterTo={'opacity-100'}
                                            leave={'duartion-500'}
                                >
                                    <Alert type={'success'} className={'px-5'}>
                                        {lang('Your item was successfully submitted! preview of your listed item can be seen below')}
                                    </Alert>
                                    <div className={'text-left rtl:text-right'}>{submittedItem}</div>
                                </Transition>
                            </StepContent>
                        </div> : <div className={'flex h-screen select-none inset-0 absolute z-10 backdrop-blur-sm items-center justify-center'}>
                            <div
                                className={'flex gap-x-5 items-center justify-center bg-lime-900 w-screen max-w-sm mx-auto p-10 rounded shadow'}>
                                <FontAwesomeIcon className={'text-4xl'} icon={faSpinner} spinPulse={true}/>
                                <span className={''}>Please Wait...</span>
                            </div>
                        </div>}
                    </PageContainer>
                </CarFormContext.Provider>
            </div>
        </form>
    </div>
}
