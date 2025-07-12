import Field from '@/Components/Form/Field'
import TextInput from '@/Components/Form/TextInput'
import TextArea from '@/Components/Form/TextArea'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faAt,
    faCircleCheck,
    faCalendarDays,
    faClock,
    faCalendarAlt,
    faExclamationCircle,
    faGlobe,
    faImage,
    faMobileAlt,
    faPhone,
    faPlus,
    faSave
} from '@fortawesome/free-solid-svg-icons'
import { ShopTypeIcons } from '@/Components/Icons/ShopTypes'
import {useForm} from '@inertiajs/react'
import InputError from '@/Components/Form/InputError'
import React, {createRef, useContext, useEffect, useState} from 'react'
import {AppContext} from '@/AppContext'
import {faCheckCircle, faCircle} from '@fortawesome/free-regular-svg-icons'
import {parseInt} from 'lodash'
import Alert from '@/Components/Alerts/Alert'
import {Checkbox, TimePicker, DatePicker} from 'antd'
import Hr from '@/Components/Hr'
import PageContainer from '@/Layouts/PageContainer'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import {faFacebookF, faInstagram, faWhatsapp} from '@fortawesome/free-brands-svg-icons'
import Contacts from '@/Components/Contacts'
import LeafletMapComponent from '@/Components/LeafletMapComponent'
import MainButton from '@/Components/Form/Buttons/MainButton'
import {clsx} from "clsx";
import dayjs from 'dayjs';

let usernameCheckTimeOut = null
export default function Form({
                                 title, shop, types,
                                 contactMethods = [], predefined_locations, csrf_token,
                             }) {
    const USERNAME_MAX_LENGTH = 30

    const {lang} = useContext(AppContext)

    const [contacts, setContacts] = useState(shop.data.contacts ?? [])

    const [showContactAddForm, setShowContactAddForm] = useState(false)
    const [selectedContactFormMethod, setSelectedContactFormMethod] = useState(null)

    const [selectedLocation, setSelectedLocation] = useState(null)

    const [shopTypes, setShopTypes] = useState(types.map(type => ({
        ...type,
        checked: shop.data.types.includes(type.id)
    })))

    const {
        data, setData, post, processing, errors, reset,
        isDirty, transform,
        setError, clearErrors,
    } = useForm({
        title: shop?.data.title ?? '',
        username: shop?.data.username ?? '',
        description: shop?.data.description ?? '',
        types: shopTypes,
        cover_photo: null,
        profile_photo: null,
        contacts: shop.data.contacts ?? [],
        predefined_location: {id: shop?.data.predefined_location ?? '', name: ''},
        opening_hour: shop?.data.opening_hour ?? '09:00',
        closing_hour: shop?.data.closing_hour ?? '18:00',
        opening_days: shop?.data.opening_days ?? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        established_at: shop?.data.established_at ?? ''
    })

    const [geoLocation, setGeoLocation] = useState({})
    const [geoLocationMessage, setGeoLocationMessage] = useState('')
    const [loadingGeoLocation, setLoadingGeoLocation] = useState('')
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState(false)
    const [profilePicture, setProfilePicture] = useState(null)
    const [photoUploadPercentage, setPhotoUploadPercentage] = useState(0)

    const [checkedTypes, setCheckedTypes] = useState(types.filter(f => f.checked))
    const profileThumbRef = createRef(null)

    transform((data) => ({
        ...data,
        types: data.types.filter(e => e.checked).map(e => e.id),
    }))

    const submit = (e) => {
        e.preventDefault()
        clearErrors()
        post(route('shop' + (shop?.data?.id ? '.single' : '') + '.store', shop?.data?.id ?? null))
    }

    const onHandleChange = (event) => {
        clearErrors(event.target?.name)
        setData(event.target.name, event.target.value)
    }

    const openFileUpload = (e) => {
        profileThumbRef.current.click()
    }

    useEffect(() => {
        let filledContacts = contacts.filter(f => f && f.value)
        setData('contacts', filledContacts)
    }, [contacts])

    useEffect(() => {
        setData('geo', geoLocation)
    }, [geoLocation])

    useEffect(() => {
        setData('location', selectedLocation)
    }, [selectedLocation])
    const onProfileThumbChange = (e) => {
        clearErrors('profile_photo')
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('p', file)
        formData.append('_token', csrf_token)

        if (file) {
            const fileObject = URL.createObjectURL(file)
            setProfilePicture(fileObject)

            // Upload Temporary profile image
            let xhr = new XMLHttpRequest()

            xhr.onreadystatechange = () => {
                switch (xhr.status) {
                    case 0: {
                        break
                    }
                    case 200: {
                        if (xhr.response) {
                            let jsonParsed = JSON.parse(xhr.response)
                            setData('profile_photo', jsonParsed.photo)
                        }
                    }
                }
            }

            xhr.upload.onprogress = (e) => {
                setPhotoUploadPercentage(parseInt((e.loaded / e.total) * 100))
            }

            xhr.open('POST', route('photos.upload'), true)
            xhr.send(formData)
        }
    }

    useEffect(() => {

        if (shop.data.username) {
            return
        }

        clearTimeout(usernameCheckTimeOut)

        usernameCheckTimeOut = setTimeout(() => {

            if (!data.username || (shop.data.username == data.username)) {
                clearErrors('username')
                setCheckingUsername(null)
                return
            }

            axios.post(route('shop.username.check'),
                {username: data.username}).then(res => {
                setUsernameStatus(true)

                clearErrors('username')
            }).catch(err => {
                setUsernameStatus(false)
                setError('username', err.response.data.errors.username[0])
            }).finally(() => {
                setCheckingUsername(false)
            })
        }, 300)

    }, [data.username])

    useEffect(() => {
        setShopTypes(types?.map(type => {
                type.checked = shop.data.types.includes(type.id) ? true : false
                return type
            }),
        )
    }, [])

    const handleOnUsernameChange = (e) => {
        clearErrors('username')
        if (validateUsername(e.target.value)) {
            setCheckingUsername(true)
            setData('username', e.target.value)
        } else {
            setError('username', 'Username may only contain latin letters or underscore, and is less than ' + USERNAME_MAX_LENGTH + ' characters long.')
            setUsernameStatus(false)
            return false
        }
    }

    const validateUsername = (value) => {
        return value?.length <= USERNAME_MAX_LENGTH && (/^[A-Za-z0-9_.]+$/.exec(value))
    }

    const addOrRemove = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]

    const contactTypeIcon = {
        WEBSITE: faGlobe,
        FACEBOOK: faFacebookF,
        INSTAGRAM: faInstagram,
        EMAIL: faAt,
        WHATSAPP: faWhatsapp,
        PHONE: faPhone,
        MOBILE: faMobileAlt,
    }

    return <PageContainer title={title} subtitle={shop?.data?.id ? 'Shop ID #' + shop.data.id : 'New Shop'}
                          mainClassName={'flex mx-auto'}>

        {Object.values(errors).length ? Object.values(errors).length && <Alert type={'danger'}>
            {Object.values(errors).map(err => <div key={err}>{err}</div>)}
        </Alert> : <></>}

        <form className={''} onSubmit={submit}>
            {/* Shop Profile Photo Section */}
            <h3 className="text-lg font-medium text-center mb-2">Shop Profile Photo</h3>
            <p className="text-xs text-center mb-4">Upload a clear, professional image that represents your shop. This will be displayed on your shop profile.</p>
            <Field>
                <div className={'group flex justify-center h-72 items-center relative rounded-xl overflow-hidden'}>

                    <input type={'file'}
                           accept={'image/*'}
                           multiple={false}
                           className={'hidden'}
                           ref={profileThumbRef}
                           onChange={onProfileThumbChange}/>
                    <div
                        className={'cursor-pointer aspect-square text-neutral-200 dark:text-neutral-700 flex items-center justify-center ' +
                            'w-60 bg-white dark:bg-neutral-800 m-2 shadow rounded-full ring hover:ring-8 hover:ring-indigo-700 ' +
                            'ring-indigo-900/20 transition-all'}
                        onClick={openFileUpload}>
                        {photoUploadPercentage !== 0 && <div
                            className={'absolute font-bold text-4xl z-10 px-2 py-1 text-white opacity-80 bg-black rounded'}>
                            {photoUploadPercentage}%
                        </div>}
                        <div className={'w-full h-full relative text-4xl'}>
                            <FontAwesomeIcon
                                className={'text-6xl group-hover:-mt-0.5 transition-all absolute top-20 mt-3 left-2/4 -ml-8'}
                                icon={faImage}/>
                            <FontAwesomeIcon icon={faPlus}
                                             className={'transition-all delay-100 absolute bottom-24 left-3/4 -ml-12 ' +
                                                 'group-hover:bottom-32  group-hover:opacity-100 opacity-20 text-white'}/>
                        </div>

                        {shop?.data?.primary_photo?.square_sm || profilePicture ?
                            <img className={'m-1 aspect-square rounded-full block w-64 p-2 absolute object-cover'}
                                 src={profilePicture ?? shop.data.primary_photo.square_sm}
                                 alt={''}/> : <></>}
                    </div>
                </div>
            </Field>

            <div className={'flex flex-wrap'}>
                <div className={'w-full lg:w-1/2'}>
                    {/* Basic Info Section */}
                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                    <Field title={lang('Shop Title')} className={'my-5'}>
                        <InputError message={errors.title} className="mt-2"/>
                        <p className={'text-xs mb-2'}>Choose a clear and descriptive title for your shop that customers
                            will easily recognize and remember.</p>
                        <TextInput
                            disabled={processing}
                            id={'title'}
                            value={data.title}
                            name={'title'}
                            placeholder={lang('Title')}
                            handleChange={onHandleChange}/>
                    </Field>
                    <Field title={lang('Shop Type')} className={'text-left rtl:text-right py-2'}>
                        <InputError message={errors.types} className={'mt-2'}/>
                        <p className={'text-xs mb-2'}>Choose type(s) that suits your shop. This helps customers find the specific services they need.</p>
                        <div className={'flex flex-wrap'}>
                            {Object.values(data.types).map(type => {
                                const IconComponent = ShopTypeIcons[type.id];
                                return (
                                    <Checkbox disabled={processing}
                                              key={type.id}
                                              name={'type'}
                                              checked={shopTypes.find(t => t.id === type.id)?.checked || false}
                                              value={type.id}
                                              onChange={e => {
                                                  const updatedTypes = shopTypes.map(t => ({
                                                      ...t,
                                                      checked: t.id === parseInt(e.target.value) ? e.target.checked : t.checked
                                                  }));
                                                  setShopTypes(updatedTypes);
                                                  setData('types', updatedTypes);
                                              }}
                                              className={'w-full mx-auto sm:w-1/2 md:w-1/3'}
                                    >
                                        {IconComponent && <IconComponent className="w-5 h-5 inline-block mr-2" />}
                                        {lang(type.title)}
                                    </Checkbox>
                                );
                            })}
                        </div>
                    </Field>

                    <Field title={lang('Username')} className={'my-5'}>
                        <InputError message={errors.username} className="mt-2"/>
                        <p className={'text-xs mb-2'}>Create a unique username for your shop URL. Use only letters,
                            numbers and underscores. Once set, this cannot be changed.</p>
                        <TextInput
                            disabled={processing || shop?.data?.username}
                            icon={
                                !checkingUsername ?
                                    (usernameStatus !== null && checkingUsername !== null && data.username && !shop?.data?.id
                                        ? (usernameStatus ? faCircleCheck : faExclamationCircle)
                                        : null)
                                    : faCircle
                            }
                            prefixIconClassName={usernameStatus ? ' dark:text-green-500 ' : ' dark:text-red-500 '}
                            isLoading={checkingUsername}
                            id={'username'}
                            value={data.username}
                            name={'username'}
                            maxLength={USERNAME_MAX_LENGTH}
                            placeholder={lang('E.g. myshop_2025')}
                            handleChange={handleOnUsernameChange}/>
                    </Field>
                    <Field title={lang('Shop Description')} className={'my-5'}>
                        <InputError message={errors.description} className="mt-2"/>
                        <p className={'text-xs mb-2'}>Describe your shop in detail. Include information about your
                            products,
                            services, specialties, and anything that makes your shop unique. A good description helps
                            customers understand what you offer.</p>
                        <TextArea
                            disabled={processing}
                            id={'description'}
                            name={'description'}
                            value={data.description}
                            rows={5}
                            placeholder={lang('Description')}
                            handleChange={onHandleChange}>
                        </TextArea>
                    </Field>

                    <Field title={lang('Predefined Location')}>
                        <InputError message={errors.predefined_location}/>
                        <p className={'text-xs'}>{lang('Select a predefined location where your shop will be located. This helps customers find shops in specific areas. Choose the most relevant area that best represents your shop\'s physical location. You can later add a precise location on the map.')}</p>
                        <div className={'flex flex-wrap justify-start w-full mx-auto mt-10 rounded'}>
                            {Object.values(predefined_locations.data).map((predefined_location, k) =>
                                <div className={'sm:w-1/2 w-full p-1 max-w-xs'}>
                                    <MainButton
                                        key={predefined_location.id}
                                        className={
                                            clsx('w-full',
                                                data.predefined_location.id == predefined_location.id ? ' bg-violet-700 text-white ' : ''
                                            )}
                                        onClick={e => setData('predefined_location', predefined_location) | clearErrors('predefined_location')}
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle}
                                                         className={'mx-2 ' + (data.predefined_location.id === predefined_location.id ? 'opacity-100 animate-pop-in-lg' : 'opacity-0')}/>
                                        {lang(predefined_location.name)}
                                    </MainButton>
                                </div>,
                            )}
                        </div>

                    </Field>

                    <Hr/>

                    {/* Hours of Operation Section */}
                    <h3 className="text-lg font-medium mt-8 mb-4">Hours of Operation</h3>
                    <Field title={lang('Opening Hours')} className={'my-5'}>
                        <InputError message={errors.opening_hour || errors.closing_hour} className="mt-2"/>
                        <p className={'text-xs mb-2'}>Set your shop's regular business hours. This helps customers know when they can visit your shop.</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm">Opening Time</label>
                                <TimePicker
                                    className="w-32"
                                    disabled={processing}
                                    format="HH:mm"
                                    value={data.opening_hour ? dayjs(data.opening_hour, 'HH:mm') : null}
                                    onChange={(time) => {
                                        setData('opening_hour', time ? time.format('HH:mm') : '09:00')
                                        clearErrors('opening_hour')
                                    }}
                                    placeholder="Opening time"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm">Closing Time</label>
                                <TimePicker
                                    className="w-32"
                                    disabled={processing}
                                    format="HH:mm"
                                    value={data.closing_hour ? dayjs(data.closing_hour, 'HH:mm') : null}
                                    onChange={(time) => {
                                        setData('closing_hour', time ? time.format('HH:mm') : '18:00')
                                        clearErrors('closing_hour')
                                    }}
                                    placeholder="Closing time"
                                />
                            </div>
                        </div>
                    </Field>

                    <Field title={lang('Opening Days')} className={'my-5'}>
                        <InputError message={errors.opening_days} className="mt-2"/>
                        <p className={'text-xs mb-2'}>Select the days your shop is open for business.</p>
                        <div className="flex flex-wrap gap-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <Checkbox
                                    key={day}
                                    disabled={processing}
                                    checked={data.opening_days.includes(day)}
                                    onChange={e => {
                                        const isChecked = e.target.checked
                                        const updatedDays = isChecked
                                            ? [...data.opening_days, day]
                                            : data.opening_days.filter(d => d !== day)

                                        setData('opening_days', updatedDays)
                                        clearErrors('opening_days')
                                    }}
                                >
                                    {day}
                                </Checkbox>
                            ))}
                        </div>
                    </Field>

                    {/* Location Section */}
                    <h3 className="text-lg font-medium mt-8 mb-4">Location & History</h3>

                    <Field title={lang('Established Date')} className={'my-5'}>
                        <InputError message={errors.established_at} className="mt-2"/>
                        <p className={'text-xs mb-2'}>When was your shop established? This helps build credibility with customers.</p>
                        <DatePicker
                            className="w-full"
                            disabled={processing}
                            value={data.established_at ? dayjs(data.established_at) : null}
                            onChange={(date) => {
                                setData('established_at', date ? date.format('YYYY-MM-DD') : '')
                                clearErrors('established_at')
                            }}
                            placeholder="Select establishment date"
                        />
                    </Field>

                    <Hr/>
                </div>
                <div className={'w-full lg:w-1/2 lg:px-10 px-0'}>
                    {/* Map & Location Section */}
                    <h3 className="text-lg font-medium mb-4">Map Location</h3>
                    <p className="text-xs mb-4">Pin your shop's exact location on the map. This helps customers find your physical location.</p>
                    <Field title={lang('Map')} className={'w-full'}>
                        <LeafletMapComponent
                            handleOnClick={e => setSelectedLocation(e)}
                            setGeoLocation={setGeoLocation}
                            setGeoLocationMessage={setGeoLocationMessage}
                            countryName="Lebanon"
                            setLoadingGeoLocation={setLoadingGeoLocation}/>
                    </Field>
                    <Hr/>

                    {/* Contact Methods Section */}
                    <h3 className="text-lg font-medium mt-8 mb-4">Contact Information</h3>
                    <p className="text-xs mb-4">Add ways for customers to contact your shop. Include social media, phone numbers, and other contact methods.</p>
                    <Field className={''} title={lang('Contact Methods')}>
                        <InputError message={errors.contacts} className="mt-2"/>

                        <i>{lang('Select type of contact')}</i>
                        <Contacts allowedContactMethods={contactMethods}
                                  rootSelectedContactMethods={data.contacts}
                                  rootSetSelectedContactMethods={setContacts}/>
                    </Field>
                </div>
            </div>

            {/* Form Summary Section */}
            <div className="w-full max-w-4xl mx-auto mt-16 mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4 text-center">Ready to {shop?.data.id ? 'Update' : 'Create'} Your Shop?</h3>
                <p className="text-sm text-center mb-6">Please review all information before submitting. Make sure your contact details and location are accurate.</p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div className="text-center">
                        <span className="block text-sm font-medium mb-1">Shop Type</span>
                        <span className="text-xs">{shopTypes.filter(t => t.checked).length} type(s) selected</span>
                    </div>

                    <div className="text-center">
                        <span className="block text-sm font-medium mb-1">Contact Methods</span>
                        <span className="text-xs">{contacts.filter(c => c && c.value).length} contact(s) added</span>
                    </div>

                    <div className="text-center">
                        <span className="block text-sm font-medium mb-1">Opening Days</span>
                        <span className="text-xs">{data.opening_days.length} day(s) selected</span>
                    </div>
                </div>
            </div>

            <div className={'mt-10 sticky bottom-0 mx-auto w-min p-2 flex gap-x-2'}>
                <PrimaryButton type={'submit'}
                               disabled={processing}
                               size={'lg'}>
                    {lang(shop?.data.id ? 'Update' : 'Create', ' ')}
                    <FontAwesomeIcon icon={faSave} className={'mr-2'}/>
                </PrimaryButton>
                {isDirty ? <SecondaryButton onClick={e => reset()}>Reset</SecondaryButton> : <></>}
            </div>

        </form>
    </PageContainer>
}
