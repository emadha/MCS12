import TextArea from '@/Components/Form/TextArea'
import TextInput from '@/Components/Form/TextInput'
import Select from '@/Components/Form/Select'
import FormUpload from '@/Components/Form/UploadDropzone'
import { faBackward } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash, faSave, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import Field from '@/Components/Form/Field'
import React, { useEffect, useState } from 'react'
import { useForm } from '@inertiajs/react'
import PageContainer from '@/Layouts/PageContainer'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import ContactSelect from '@/Components/ContactSelect'
import InputError from '@/Components/Form/InputError'

export default function Edit ({ className, item, conditions = [], currencies = [], contactMethods = [] }) {

    const [files, setFiles] = useState(item?.photos ?? [])

    const {
        post, data, setData,
        processing,
        errors, hasErrors, clearErrors, reset, isDirty,
    } = useForm({
        description: item.description,
        price: item.price,
        condition: item.condition,
        photos: item.photos,
    })

    const [showRoom, setShowroom] = useState()
    const setStepError = () => {

    }

    useEffect(() => {
        setData('photos', files)
    }, [files])

    const submit = (e) => {
        e.preventDefault()
        post(route('listing.single.store', item.id))
    }

    return <PageContainer className={'max-w-xl shadow mx-auto'} title={'Edit'}>

        <form>
            <FormUpload
                clearErrors={clearErrors}
                setStepError={setStepError}

                initialFileList={item.photos.map(
                    photo => {
                        return {
                            url: photo.path.square_sm,
                            uid: photo.user_id,
                            name: photo.filename,
                            status: 'done',
                        }
                    })}
                files={files}
                setFiles={setFiles}
            >
            </FormUpload>

            <Field title={'Basic Information'}>

                <TextInput
                    className={'w-full'}
                    value={data.price}
                    placeholder={'Price'}
                    disabled={processing}
                    handleChange={e => setData('price', e.target.value)}
                />
                {errors.price && <InputError className={'py-2'} message={errors.price}/>}

                <Field>
                    <Select options={conditions.map(condition => { return { label: condition, value: condition }})}
                            placeholder={'Condition'}
                            clearable={false}
                            multi={false}
                            defaultValue={{ value: data.condition, option: { label: conditions[data.condition], value: conditions[data.condition] } }}
                            handleOnChange={e => setData('condition', e.target.value)}
                            disabled={processing}/>
                    {errors.condition && <InputError className={'py-2'} message={errors.condition}/>}
                </Field>

                <Field>
                    <TextArea className={'w-full'} rows={10}
                              defaultValue={data.description}
                              placeholder={'Description'}
                              handleChange={e => setData('description', e.target.value)}
                              disabled={processing}
                    />
                    {errors.description && <InputError className={'py-2'} message={errors.description}/>}
                </Field>
                <div className={'flex'}>
                    <div className={'w-1/4'}>
                        <SecondaryButton processing={processing} type={'submit'} onClick={submit} icon={faSave}>Save</SecondaryButton>
                    </div>
                    <div className={'w-3/4 flex justify-end gap-x-0.5'}>
                        <SecondaryButton disabled={processing} icon={faBackward}>Cancel</SecondaryButton>
                        <SecondaryButton disabled={processing} icon={faEyeSlash}>Unpublish</SecondaryButton>
                        <SecondaryButton disabled={processing} icon={faTrashCan}>Remove</SecondaryButton>
                    </div>
                </div>
                <Field title={'Contact Information'}>
                    <ContactSelect methods={contactMethods}/>
                </Field>
            </Field>
        </form>

    </PageContainer>
}
