import Field from '@/Components/Form/Field'
import TextInput from '@/Components/Form/TextInput'
import TextArea from '@/Components/Form/TextArea'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { useForm, usePage } from '@inertiajs/react'
import Alert from '@/Components/Alerts/Alert'
import InputLabel from '@/Components/Form/InputLabel'
import Hr from '@/Components/Hr'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { AppContext } from '@/AppContext'

export default function ReportForm({ className, h }) {
    const { user } = usePage().props.auth
    const { setModalData, setModalShow, lang } = useContext(AppContext)
    const [processing, setProcessing] = useState(true)
    const [wasSuccessful, setWasSuccessful] = useState(null)
    const [responseMessage, setResponseMessage] = useState('')
    const { data, setData, errors, setError, clearErrors } = useForm({
        email: null, message: null, h: h,
    })

    useEffect(() => {
        setProcessing(false)
    }, [])
    const submit = (e) => {
        e.preventDefault()
        clearErrors()
        setProcessing(true)

        // 10 text length for message
        if (data.message?.trim()?.length < 10) {
            setError('message', 'The msssssessage field must be at least 10 chasracters.')
            return
        }

        axios.post(route('reports.submit'), data).then(res => {
            setModalData(() => {
                return {
                    title: null,
                    content: <Alert type={res.data.status ? 'success' : 'danger'}>{res.data.message}</Alert>,
                }
            })
        }).catch(err => {
            if (err.response.data.status !== 'undefined' && err.response.data.message) {
                setError('message', err.response.data.message)
            } else {
                setError('fatal', err.response.data.errors)
            }

        }).finally(() => {
            setProcessing(false)
        })
    }

    return <form onSubmit={submit} className={'p-5 sm:p-10'}>
        {Object.values(errors).length ? <Alert type={'danger'}>
            {Object.values(errors).map(err => <p>{err}</p>)}
        </Alert> : <></>}
        <Transition show={!wasSuccessful}>
            {!user?.data ? <Field>
                <InputLabel forInput={'email'}>{lang('E-mail')}</InputLabel>
                <TextInput
                    id={'email'}
                    handleChange={(e) => setData('email', e.target.value)}
                    name={'email'}
                    defaultValue={user?.data?.email}
                    disabled={processing || user?.data?.email}
                    placeholder={lang('Your E-mail', '...')}/>
                <Hr/>
            </Field> : <></>}
            <Field>
                <InputLabel forInput={'message'}>{lang('Message')}</InputLabel>
                <TextArea
                    id={'message'}
                    handleChange={(e) => setData('message', e.target.value)}
                    name={'message'}
                    disabled={processing}
                    placeholder={lang('Enter your report message here...')}/>
            </Field>

            <div className={'flex sm:flex-nowrap gap-x-2 flex-wrap gap-y-2 justify-center w-full mt-10'}>
                <SecondaryButton className={'w-full sm:w-max p-2'} disabled={processing} size={'lg'}
                                 onClick={() => setModalShow(false)}>{lang('Cancel')}</SecondaryButton>
                <PrimaryButton
                    className={'w-full sm:w-max'}
                    disabled={!data.message || data.message?.trim()?.length < 10 || processing}
                    processing={processing}
                    size={'lg'}
                    type={'submit'} icon={faPaperPlane}>
                    {lang('Send Report')}
                </PrimaryButton>
            </div>
        </Transition>
    </form>
}
