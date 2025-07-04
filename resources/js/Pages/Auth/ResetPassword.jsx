import { useContext, useEffect } from 'react'
import InputError from '@/Components/Form/InputError'
import InputLabel from '@/Components/Form/InputLabel'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import TextInput from '@/Components/Form/TextInput'
import { useForm } from '@inertiajs/react'
import PageContainer from '@/Layouts/PageContainer'
import { AppContext } from '@/AppContext'

export default function ResetPassword ({ token, email, title }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
    })
    const { lang } = useContext(AppContext)

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation')
        }
    }, [])

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value)
    }

    const submit = (e) => {
        e.preventDefault()
        setData('token', token)
        post(route('password.store'))
    }

    return (
        <PageContainer title={title} className={'max-w-md'}>

            <form onSubmit={submit}>
                <input type={'hidden'} name={'token'} value={token}/>
                <div>
                    <InputLabel forInput="email" value={lang('Email')}/>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        handleChange={onHandleChange}
                    />

                    <InputError message={errors.email} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel forInput="password" value={lang('Password')}/>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        handleChange={onHandleChange}
                    />

                    <InputError message={errors.password} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel forInput="password_confirmation" value={lang('Confirm password')}/>

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        handleChange={onHandleChange}
                    />

                    <InputError message={errors.password_confirmation} className="mt-2"/>
                </div>

                <PrimaryButton type={'submit'} processing={processing} className={'mx-auto mt-8'}>
                    {lang('Reset Password')}
                </PrimaryButton>
            </form>
        </PageContainer>
    )
}
