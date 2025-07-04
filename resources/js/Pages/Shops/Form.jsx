import Field from '@/Components/Form/Field'
import TextInput from '@/Components/Form/TextInput'
import TextArea from '@/Components/Form/TextArea'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faCircleCheck, faExclamationCircle, faGlobe, faImage, faMobileAlt, faPhone, faPlus, faSave } from '@fortawesome/free-solid-svg-icons'
import { useForm } from '@inertiajs/react'
import InputError from '@/Components/Form/InputError'
import React, { createRef, useContext, useEffect, useState } from 'react'
import { AppContext } from '@/AppContext'
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons'
import { parseInt } from 'lodash'
import Alert from '@/Components/Alerts/Alert'
import InputLabel from '@/Components/Form/InputLabel'
import { Checkbox } from 'antd'
import Hr from '@/Components/Hr'
import PageContainer from '@/Layouts/PageContainer'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import Contacts from '@/Components/Contacts'
import GoogleMapComponent from '@/Components/GoogleMapComponent'
import MainButton from '@/Components/Form/Buttons/MainButton'

let usernameCheckTimeOut = null
export default function Form ({
    title, shop, types,
    contactMethods = [], predefined_locations, csrf_token,
}) {
    const USERNAME_MAX_LENGTH = 30

    const { lang } = useContext(AppContext)

    const [contacts, setContacts] = useState(shop.data.contacts ?? [])

    const [showContactAddForm, setShowContactAddForm] = useState(false)
    const [selectedContactFormMethod, setSelectedContactFormMethod] = useState(null)

    const [selectedLocation, setSelectedLocation] = useState(null)

    const [shopTypes, setShopTypes] = useState(types)

    const {
        data, setData, post, processing, errors, reset,
        isDirty, transform,
        setError, clearErrors,
    } = useForm({
        title: shop?.data.title ?? '',
        username: shop?.data.username ?? '',
        description: shop?.data.description ?? '',
        types: types,
        cover_photo: null,
        profile_photo: null,
        contacts: shop.data.contacts ?? [],
        predefined_location: { id: shop?.data.predefined_location ?? '', name: '' },
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

        if (shop.data.id) {
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
                { username: data.username }).then(res => {
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

    const ContactAddForm = ({ contactTypes, value }) => {
        const [step, setStep] = useState(0)
    }

    return <PageContainer title={title} subtitle={shop?.data?.id ? 'Shop ID #' + shop.data.id : 'New Shop'} mainClassName={'flex mx-auto'}>


        {Object.values(errors).length ? Object.values(errors).length && <Alert type={'danger'}>
            {Object.values(errors).map(err => <div key={err}>{err}</div>)}
        </Alert> : <></>}

        <form className={''} onSubmit={submit}>
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

                        {shop?.data?.primary_photo?.square_sm || profilePicture ? <img className={'m-1 aspect-square rounded-full block w-64 p-2 absolute object-cover'}
                                                                                       src={profilePicture ?? shop.data.primary_photo.square_sm}
                                                                                       alt={''}/> : <></>}
                    </div>
                </div>
            </Field>

            <div className={'flex flex-wrap'}>
                <Field className={'w-full lg:w-1/2'} title={lang('Details')}>
                    <Field className={'my-5'}>
                        <TextInput
                            disabled={processing}
                            id={'title'}
                            value={data.title}
                            name={'title'}
                            placeholder={lang('Title')}
                            handleChange={onHandleChange}/>
                        <InputError message={errors.title} className="mt-2"/>
                    </Field>
                    <Field className={'my-5'}>
                        <div>
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
                                placeholder={lang('Username (only latin letters and underscore allowed)')}
                                handleChange={handleOnUsernameChange}/>
                            <InputError message={errors.username} className="mt-2"/></div>
                    </Field>
                    <Field className={'my-5'}>
                        <TextArea
                            disabled={processing}
                            id={'description'}
                            name={'description'}
                            value={data.description}
                            rows={5}
                            placeholder={lang('Description')}
                            handleChange={onHandleChange}>
                        </TextArea>
                        <InputError message={errors.description} className="mt-2"/>
                    </Field>

                    <Field className={''}>
                        <InputLabel>{lang('Predefined Location')}</InputLabel>
                        <small>{lang('Your shop will be located in these main locations.')}</small>
                        {errors.predefined_location ? <InputError message={errors.predefined_location}/> : <></>}
                        <div className={'flex flex-wrap justify-start w-full mx-auto mt-10 rounded'}>
                            {Object.values(predefined_locations.data).map((predefined_location, k) =>
                                <div className={'sm:w-1/2 w-full p-1 max-w-xs'}>
                                    <MainButton
                                        key={predefined_location.id}
                                        className={'w-full border rounded text-neutral-500' +
                                            (data.predefined_location.id == predefined_location.id ? ' bg-violet-700 text-white ' : '')}
                                        onClick={e => setData('predefined_location', predefined_location) || clearErrors('predefined_location')}
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle}
                                                         className={'mx-2 ' + (data.predefined_location.id === predefined_location.id ? 'opacity-100 animate-pop-in-lg' : 'opacity-0')}/>
                                        {lang(predefined_location.name)}
                                    </MainButton>
                                </div>,
                            )}
                        </div>

                        <InputError message={errors.location} className={'mt-2'}/>
                    </Field>

                    <Hr/>

                    <Field className={'text-left rtl:text-right py-2'}>
                        <InputLabel>{lang('Shop type')}</InputLabel>
                        <small>{lang('Choose type(s) that suits your shop.')}</small>
                        <div className={'flex flex-wrap'}>
                            {Object.values(data.types).map(type =>
                                <Checkbox disabled={processing}
                                          key={type.id}
                                          name={'type'}
                                          value={type.id}
                                          onChange={e => {
                                              setShopTypes(prevState => prevState.map(t => {
                                                  if (t.id === e.target.value) {
                                                      t.checked = e.target.checked
                                                  }
                                                  return t
                                              }))

                                          }}
                                          checked={type.checked}
                                          className={'w-full mx-auto sm:w-1/2 md:w-1/3'}
                                >{lang(type.title)}</Checkbox>)
                            }
                        </div>
                    </Field>
                    <Hr/>
                </Field>
                <div className={'w-full lg:w-1/2 lg:px-10 px-0'}>
                    <Field title={lang('Map')} className={'w-full'}>
                        <GoogleMapComponent
                            handleOnClick={e => setSelectedLocation(e)}
                            setGeoLocation={setGeoLocation}
                            setGeoLocationMessage={setGeoLocationMessage}
                            setLoadingGeoLocation={setLoadingGeoLocation}/>
                    </Field>

                    <Hr/>
                    <Field className={''} title={lang('Contact')}>
                        <i>{lang('Select type of contact')}</i>
                        <Contacts allowedContactMethods={contactMethods}
                                  rootSelectedContactMethods={data.contacts}
                                  rootSetSelectedContactMethods={setContacts}/>
                    </Field>
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
