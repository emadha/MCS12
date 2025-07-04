import { useContext, useEffect } from 'react'
import InputLabel from '@/Components/Form/InputLabel'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import TextInput from '@/Components/Form/TextInput'
import { Link, useForm } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { AppContext } from '@/AppContext'
import { Checkbox } from 'antd'
import Hr from '@/Components/Hr'
import Alert from '@/Components/Alerts/Alert'

export default function LoginComponent ({ status, canResetPassword = true }) {
    const { lang, setModalShow } = useContext(AppContext)
    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({ email: '', password: '', remember: '' })

    useEffect(() => {
        return () => {
            reset('password')
        }
    }, [])

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value)
    }

    const submit = (e) => {
        e.preventDefault()
        post(route('login'), {
            onBefore: () => clearErrors(),
            onSuccess: () => {
                setModalShow(false)
            },
        })
    }
    const SocialMediaButtons = ({ children, href }) => <a
        className={'login-social-btn'}
        href={href}>
        {children}
    </a>

    return <>

        {status && <div className="text-center mb-4 font-medium text-sm text-green-600">{status}</div>}

        <form onSubmit={submit}>

            <div className={'@container'}>
                <div className={'rounded space-y-4 @2xl:p-10 px-10 flex flex-wrap justify-between items-center gap-y-5 @container'}>

                    <div className={'@md:w-1/2 w-full'}>

                        <Hr className={'!my-10'}/>
                        {Object.values(errors).length ? <Alert type={'danger'} pro className={' !mb-5 '} dismissible={true}>
                            {Object.values(errors).map(e => <p>{e}</p>)}
                        </Alert> : <></>}
                        <div className={''}>
                            <InputLabel forInput="email" value={lang('Email')}/>

                            <TextInput
                                required
                                hasError={errors.email}
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                handleChange={onHandleChange}
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel forInput="password" value={lang('Password')}/>

                            <TextInput
                                required
                                hasError={errors.password}
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                handleChange={onHandleChange}
                            />
                        </div>

                        <div className="w-full whitespace-nowrap mt-4 flex justify-between gap-x-2">
                            <label className="flex items-center w-min">
                                <Checkbox name="remember" value={data.remember} handleChange={onHandleChange}>
                                    <span className="ml-2 text-sm text-gray-600">{lang('Remember me')}</span>
                                </Checkbox>
                            </label>
                            <PrimaryButton type={'submit'} className={''} processing={processing}>
                                {lang('Log in')}
                            </PrimaryButton>
                        </div>
                        <Hr/>
                        <div className="flex underline justify-between gap-x-5">
                            <Link href={route('register')} className={'hover:text-gray-900 dark:hover:text-white'}>{lang('Register')}</Link>
                            {canResetPassword ? <Link
                                    href={route('password.request')}
                                    className={'hover:text-gray-900 dark:hover:text-white inline-block'}>
                                    {lang('Forgot your password?')}
                                </Link>
                                : <></>
                            }


                        </div>
                    </div>
                    <div className={'@md:w-1/2 w-full'}>
                        <div className={'flex gap-y-2 w-full flex-wrap justify-start pl-10 rtl:pr-10 rtl:pl-0'}>

                            <SocialMediaButtons href={route('login.google')}>
                                <span>Login Using Google</span>
                                <FontAwesomeIcon icon={faGoogle} className={'text-3xl px-2'}/>
                            </SocialMediaButtons>
                            <SocialMediaButtons href={route('login.microsoft')}>
                                <span>Login Using Microsoft</span>
                                <FontAwesomeIcon icon={faMicrosoft} className={'text-3xl px-2'}/>
                            </SocialMediaButtons></div>
                    </div>
                </div>
            </div>
        </form>
    </>
}
