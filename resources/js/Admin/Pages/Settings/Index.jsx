import React, { useState } from 'react'
import Field from '@/Components/Form/Field'
import TextInput from '@/Components/Form/TextInput'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import TextArea from '@/Components/Form/TextArea'
import { Radio } from 'antd'
import { Link, useForm } from '@inertiajs/react'
import Alert from '@/Components/Alerts/Alert'
import Hr from '@/Components/Hr'

export default function Index ({ settings }) {

    const {
        post, data,
        wasSuccessful, errors = [], clearErrors,
        setData, processing,
    } = useForm({
        site_title: settings.site_title,
        site_description: settings.site_description,
        site_robots: parseInt(settings.site_robots),
    })

    const [loading, setLoading] = useState(false)

    const submit = (e) => {
        clearErrors()
        setLoading(true)
        e.preventDefault()
        post(route('admin.settings.post'), {
            onFinish: params => {
                setLoading(false)
            },
        })
    }

    return <>
        <div className={''}>

            {wasSuccessful
                ? <Alert type={'success'}></Alert>
                : <div className={'flex flex-wrap gap-y-2 '}>
                    {Object.values(errors).map(err =>
                        <Alert className={'w-full'} type={'danger'}>{err}</Alert>)}
                </div>
            }

            <div className={'flex'}>
                <div className={'w-1/4'}>
                    <h4>Navigation</h4>
                    <ul>
                        <li>
                            <Link href={'/'}>Dashboard</Link>
                        </li>
                        <li>
                            <Link href={'/ads'}>Ads</Link>
                        </li>
                    </ul>
                </div>
                <form className={'w-2/4'} onSubmit={submit}>
                    <Field title={'Site Title'}>
                        <TextInput placeholder={'Site Title'} value={data.site_title}
                                   disabled={processing | loading}
                                   handleChange={(e) => setData('site_title', e.target.value)}
                        />

                    </Field>
                    <Field title={'Site Description'}>
                        <TextArea placeholder={'Site Description'}
                                  disabled={processing | loading}
                                  defaultValue={data.site_description}
                                  handleChange={(e) => setData('site_description', e.target.value)}
                        />
                    </Field>
                    <Field title={'Allow indexing'}>
                        <Radio checked={data.site_robots === 0}
                               value={0}
                               disabled={processing | loading}
                               onChange={e => setData('site_robots', e.target.value)}>
                            Index, Follow</Radio>
                        <Radio checked={data.site_robots === 1}
                               value={1}
                               disabled={processing | loading}
                               onChange={e => setData('site_robots', e.target.value)}>
                            Index, Nofollow</Radio>
                        <Radio checked={data.site_robots === 2}
                               value={2}
                               disabled={processing | loading}
                               onChange={e => setData('site_robots', e.target.value)}>
                            Noindex, Nofollow</Radio>
                        <Radio checked={data.site_robots === 3}
                               value={3}
                               disabled={processing | loading}
                               onChange={e => setData('site_robots', e.target.value)}>
                            Noindex, Follow</Radio>
                    </Field>
                    <Hr className={'!my-10'}/>
                    <PrimaryButton processing={processing || loading} type={'submit'}>Save</PrimaryButton>
                </form>
            </div>
        </div>
    </>
}


