import PageContainer from '@/Layouts/PageContainer'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'
import Field from '@/Components/Form/Field'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import TextInput from '@/Components/Form/TextInput'
import { useForm } from '@inertiajs/react'
import Alert from '@/Components/Alerts/Alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function Deactivate ({ title }) {
    const { lang } = useContext(AppContext)
    const { delete: destroy, data, setData, errors, clearErrors, processing } = useForm()

    const submit = (e) => {
        e.preventDefault()

        clearErrors()
        destroy(route('profile.destroy'), {
            method: 'delete',
        })

    }

    return <PageContainer title={lang(title)} className={'text-center max-w-xl'}>
        {!processing ? <form onSubmit={submit}>
            {Object.values(errors).length ? <div className={'my-10'}>
                <Alert type={'danger'}>
                    {Object.values(errors).map(error => lang(error))}
                </Alert>
            </div> : <></>}

            <Field className={'py-10'}>
                {lang('Do you really want to deactivate your profile?, if yes then please confirm your password and press')} <strong className={'border-b'}>{lang('Yes, Deactivate')}</strong>.
            </Field>
            <Field className={'py-10'}>
                <TextInput disabled={processing} id={'confirm'} label={lang('Confirm password')} className={'text-left'} name={'password'} type={'password'}
                           handleChange={e => setData('password', e.target.value)}/>
            </Field>
            <Field>
                <PrimaryButton type={'submit'} disabled={processing}>{lang('Yes, Deactivate')}</PrimaryButton>
            </Field>
        </form> : <>
            <FontAwesomeIcon icon={faSpinner} spinPulse={true} className={'text-5xl'}/>
        </>
        }

    </PageContainer>
}
