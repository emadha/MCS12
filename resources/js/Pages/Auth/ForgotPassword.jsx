import InputError from '@/Components/Form/InputError'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import TextInput from '@/Components/Form/TextInput'
import { Link, useForm } from '@inertiajs/react'
import { AppContext } from '@/AppContext'
import { useContext } from 'react'
import PageContainer from '@/Layouts/PageContainer'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { faMailForward, faMailReply, faReply, faUpload } from '@fortawesome/free-solid-svg-icons'
import { faReplyd } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import LoginComponent from '@/Components/LoginComponent'

export default function ForgotPassword ({ title, status }) {
    const { lang } = useContext(AppContext)

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    })

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value)
    }

    const submit = (e) => {
        e.preventDefault()

        post(route('password.email'))
    }

    return <PageContainer title={lang(title)} className={'!max-w-xl'}>


        {status ? <div className="mb-4 font-medium text-sm text-center text-green-600">
                {status}

            </div>
            : <form onSubmit={submit}>

                <div className="mb-4 text-sm text-gray-600">
                    {lang('FORGOT_PASSWORD_MSG')}
                </div>

                <div className={'my-10 max-w-md px-5 mx-auto'}><TextInput
                    id="password"
                    placeholder={lang('Enter your e-mail address here.')}
                    type="email"
                    name="email"
                    value={data.email}
                    className={'mt-1 block w-full flex justify-center'}
                    isFocused={true}
                    handleChange={onHandleChange}
                />
                    <InputError message={errors.email} className="mt-2"/></div>


                <PrimaryButton type={'submit'} className={'mx-auto mb-2'} processing={processing} icon={faEnvelope}>
                    {lang('Email Password Reset Link')}
                </PrimaryButton>

                <Link href={'/'}>
                </Link>
            </form>}

        <Link href={route('login')}>
            <SecondaryButton type={'submit'}
                             icon={faReply}
                             className="mx-auto max-w-lg"
                             disabled={processing}>
                {lang('Login')}
            </SecondaryButton>
        </Link>
    </PageContainer>
}
