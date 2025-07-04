import PageContainer from '@/Layouts/PageContainer'
import TextInput from '@/Components/Form/TextInput'
import React, { createRef, useContext, useState } from 'react'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { faImage, faPlus, faSave, faUndo } from '@fortawesome/free-solid-svg-icons'
import { Link, useForm } from '@inertiajs/react'
import toast from 'react-hot-toast'
import { AppContext } from '@/AppContext'
import Field from '@/Components/Form/Field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { parseInt } from 'lodash'
import Alert from '@/Components/Alerts/Alert'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import Hr from '@/Components/Hr'
import { Inertia } from '@inertiajs/inertia'

export default function Edit ({ auth, title, csrf_token }) {

  const { user } = auth

  const { lang, setModalShow, setModalData } = useContext(AppContext)
  const [profilePicture, setProfilePicture] = useState()
  const [photoUploadPercentage, setPhotoUploadPercentage] = useState(0)
  const profileThumbRef = createRef(null)

  const {
    data, setData, errors, setErrors, clearErrors, processing, wasSuccessful, isDirty, patch, reset,
    setDefaults,
  } = useForm({
    first_name: user.data.first_name,
    last_name: user.data.last_name, email: user.data.email,
    cover_photo: user.data.profile_picture,
    profile_photo: profilePicture,
  })

  const { errors: errors2, clearErrors: clearErrors2, processing: processing2, patch: patch2 } = useForm()

  const submit = (e) => {
    e.preventDefault()

    patch(route('profile.update'), {
      onSuccess: (data) => {
        toast.success('Profile updated')
      },
    })
  }

  const openFileUpload = (e) => {
    profileThumbRef.current.click()
  }

  const promptSocialChange = () => {
    setModalShow(true)
    setModalData({
      content: <>
        {user.data.google_id
          ? <div className={'flex items-end justify-between'}>
            <Field>
              Do you really want to disconnect from google?
            </Field>

            <div className={'flex gap-x-2'}>
              <PrimaryButton onClick={() => {
                patch(route('profile.disconnect.google'))
              }}>Disconnect</PrimaryButton>
              <SecondaryButton onClick={e => setModalShow(false)}>Cancel</SecondaryButton></div>
          </div>
          : <div className={'flex gap-x-2 items-center justify-center'}>
            <p>You can connect your <strong>Google</strong> account, so you can easily login in the future.</p>
            <PrimaryButton onClick={() => Inertia.patch(route('profile.connect.google'), {}, {
              onError: () => {

              },
            })}>
              Connect with Google
            </PrimaryButton></div>}
      </>,
    })
  }
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

  return <PageContainer className={'!max-w-xl'}>

    {Object.values(errors).length ? <div className={'pb-10'}><Alert type={'danger'}>
      {Object.values(errors).map(r => r)}
    </Alert></div> : <></>}

    <form onSubmit={submit} className={'flex items-center flex-wrap justify-center'}>

      <div className={'w-full'}>
        <Field>
          <div className={'group flex justify-center items-center relative rounded-xl'}>

            <input type={'file'}
                   accept={'image/*'}
                   multiple={false}
                   className={'hidden'}
                   ref={profileThumbRef}
                   onChange={onProfileThumbChange}/>
            <div
              className={'cursor-pointer aspect-square text-neutral-200 dark:text-neutral-700 flex items-center justify-center ' +
                'w-60 bg-white dark:bg-neutral-800 shadow rounded-full ring hover:ring-8 hover:ring-indigo-700 ' +
                'ring-indigo-900/20 transition-all'}
              onClick={openFileUpload}>
              {photoUploadPercentage !== 0 && <div
                className={'absolute font-bold text-4xl z-10 px-2 py-1 text-white opacity-80 bg-black rounded'}>
                {photoUploadPercentage}%
              </div>}
              <div className={'w-full h-full relative text-4xl'}>
                <FontAwesomeIcon
                  className={'text-6xl group-hover:-mt-0.5 transition-all absolute top-20 mt-3 left-2/4 -ml-8'}
                  icon={faImage}
                />
                <FontAwesomeIcon icon={faPlus}
                                 className={'transition-all delay-100 absolute bottom-24 left-3/4 -ml-12 ' +
                                   'group-hover:bottom-32  group-hover:opacity-100 opacity-20 text-white'}/>
              </div>

              <img className={'m-1 aspect-square rounded-full block h-full p-2 absolute object-cover'}
                   src={profilePicture ?? user.data.profile_picture}
                   alt=""/>
            </div>
          </div>
        </Field>
      </div>

      <div className={'flex flex-wrap sm:gap-x-5 w-full sm:w-3/4 content-start'}>
        <div className={'flex sm:flex-nowrap flex-wrap w-full gap-x-5'}>
          <TextInput
            className={'w-full sm:w-1/2'}
            id={'First name'}
            label={lang('First name')}
            value={data.first_name}
            disabled={processing}
            placeholder={'First name'}
            handleChange={(e) => setData('first_name', e.target.value)}
          />

          <TextInput
            className={'w-full sm:w-1/2'}
            id={'Last name'}
            label={lang('Last name')}
            value={data.last_name}
            placeholder={'Last name'}
            disabled={processing}
            handleChange={(e) => setData('last_name', e.target.value)}
          />
        </div>

        <div className={'w-full'}>
          <TextInput
            id={'email'}
            label={lang('E-mail')}
            disabled={true}
            value={data.email}
            handleChange={(e) => setData('email', e.target.value)}
          />
        </div>
        <Hr/>
        <div className={'w-full flex justify-end'}>
          <Field title={'Google login'} className={'text-right flex items-end'}>
            <PrimaryButton onClick={promptSocialChange} icon={faGoogle} className={''}>
              {user.data.google_id ?? 'Connect with Google'}
            </PrimaryButton>
          </Field>

        </div>
        <Hr/>
      </div>
      <div className={'mt-5 flex gap-x-2 w-full justify-end'}>

        <PrimaryButton className={'w-1/2 max-w-max'} type={'submit'}
                       disabled={processing}
                       icon={faSave}
                       processing={processing}>{lang('Save')}</PrimaryButton>

        {isDirty ? <SecondaryButton disabled={processing}
                                    className={'w-1/2 w-auto animate-pop-in'}
                                    icon={faUndo}
                                    onClick={() => reset()}>{lang('Undo')}
        </SecondaryButton> : <></>}

        <Link href={route('profile.deactivate')} className={'block p-1'}>Deactivate Profile</Link>
      </div>
    </form>
  </PageContainer>
}
