import { useContext, useEffect } from 'react'
import InputError from '@/Components/Form/InputError'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import TextInput from '@/Components/Form/TextInput'
import { Link, useForm } from '@inertiajs/react'
import { AppContext } from '@/AppContext'
import PageContainer from '@/Layouts/PageContainer'

export default function Register () {
    const { lang } = useContext(AppContext)
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation')
        }
    }, [])

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value)
    }

    const submit = (e) => {
        e.preventDefault()

        post(route('register'))
    }

    return <PageContainer
        className={'!max-w-xl mx-auto shadow-sm bgs-neutral-50 dark:bg-neutral-800/20 rounded'}>

        <form onSubmit={submit}>

            <div className={'mb-10 text-center'}>
                <h1 className={'text-6xl'}>{lang('Register')}</h1>
            </div>
            <div className={'items-start gap-x-5'}>

                <div className={'w-52 mx-auto  h-full aspect-square bg-neutral-700 rounded-full'}>
                    <img className={'w-full'} src="" alt=""/>
                </div>

                <div className={'max-w-md mx-auto fle flex-wrap justify-between'}>
                    <div className={'flex gap-x-5'}><TextInput
                        id="name"
                        className={'w-full sm:w-1/2'}
                        label={lang('First name')}
                        name="first_name"
                        value={data.first_name}
                        autoComplete="first_name"
                        handleChange={onHandleChange}
                        placeholder={lang('First name')}
                        required
                    />
                        <TextInput
                            id="name"
                            className={'w-full sm:w-1/2'}
                            label={lang('Last name')}
                            name="last_name"
                            value={data.last_name}
                            placeholder={lang('Last name')}
                            autoComplete="last_name"
                            handleChange={onHandleChange}
                            required
                        /></div>
                    <InputError message={errors.name} className="mt-2"/>
                    <div className="mt-4 w-full">
                        <TextInput
                            label={lang('E-mail address')}
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            handleChange={onHandleChange}
                            placeholder={lang('E-mail address')}
                            required/>
                        <InputError message={errors.email} className="mt-2"/>
                    </div>
                    <div className="mt-4">
                        <TextInput
                            label={lang('Password')}
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            handleChange={onHandleChange}
                            placeholder={lang('Password')}
                            required
                        />

                        <InputError message={errors.password} className="mt-2"/>
                    </div>

                    <div className="mt-4">

                        <TextInput
                            label={lang('Password confirmation')}
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            placeholder={lang('Password Confirmation')}
                            handleChange={onHandleChange}
                            required
                        />

                        <InputError message={errors.password_confirmation} className="mt-2"/>
                    </div>
                </div>

            </div>

            <div className="flex items-center justify-end mt-4">
                <Link
                    href={route('login')}
                    className={'underline text-sm text-gray-600 hover:text-gray-900 dark:hover:text-white transition-all rounded-md ' +
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}>
                    Already registered? Login here
                </Link>

                <PrimaryButton className="ml-4" type={'submit'} processing={processing}>
                    Register
                </PrimaryButton>
            </div>
        </form>
    </PageContainer>
}
