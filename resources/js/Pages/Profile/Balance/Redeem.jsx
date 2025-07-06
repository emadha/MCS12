import PageContainer from '@/Layouts/PageContainer'
import {useContext, useState} from 'react'
import {AppContext} from '@/AppContext'
import TextInput from '@/Components/Form/TextInput'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import Field from '@/Components/Form/Field'
import Alert from '@/Components/Alerts/Alert'

export default function Redeem({title}) {
    const {lang} = useContext(AppContext)
    const [code, setCode] = useState('')
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState([])
    const [message, setMessage] = useState('')

    const submit = (e) => {
        e.preventDefault()
        setProcessing(true)
        setErrors([])
        setMessage('')
        axios.post(route('balance.redeem.post'), {code: code}).then(res => {
            setErrors([])
            setMessage(res.data.message)
        }).catch(err => {
            setErrors(Object.values(err.response.data.errors))
        }).finally(() => {
            setProcessing(false)
        })
    }
    return <PageContainer title={title} className={'px-10 !max-w-[800px] rounded-xl shadow bg-grad-primary'}>

        {errors.length ?
            <Field>
                <Alert type={'danger'}>
                    {errors.map(error => <p>{error}</p>)}
                </Alert>
            </Field>
            : <></>}

        {message ?
            <Field>
                <Alert type={'success'}>
                    {message}
                </Alert>
            </Field>
            : <></>}
        <p className="text-center select-none mb-6">Enter your 14-character redemption code below to add credits to your
            account
            balance. Make sure to input the code exactly as it appears, including any dashes or special characters.</p>
        <form onSubmit={submit}>
            <TextInput disabled={processing}
                       className={'font-mono text-2xl uppercase'}
                       handleChange={e => {
                           e.target.value = e.target.value.toUpperCase()
                           setCode(e.target.value)
                       }}
                       name={'code'}
                       placeholder={lang('14 characters long code here...')}/>
            <Field>
                <PrimaryButton disabled={processing} type={'submit'}>Redeem</PrimaryButton>
            </Field>
        </form>
    </PageContainer>
}
