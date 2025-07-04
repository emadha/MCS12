import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { Link, useForm } from '@inertiajs/react'
import PageContainer from '@/Layouts/PageContainer'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function VerifyEmail({ title, status }) {
    const { post, processing, errors } = useForm({})

    const submit = (e) => {
        e.preventDefault()

        post(route('verification.send'), {
            onSuccess: () => {
            },
            onBefore: b => {
            },
            onFinish: (f) => {
            },
            onError: (err) => {
            },
        })
    }

    const { lang } = useContext(AppContext)

    const getStatus = (_status) => {
        switch (_status) {
            case 'verification-link-sent': {
                return <div className="mb-4 mx-auto font-medium text-sm text-green-600 max-w-xl flex justify-center items-center gap-x-2">
                    {lang('VERIFICATION_NEW_SENT')}
                </div>
            }

            case 'fatal-error': {
                return <div className="mb-4 mx-auto font-medium text-sm text-red-600 max-w-xl flex justify-center items-center gap-x-2">
                    <FontAwesomeIcon icon={faExclamationTriangle}/>
                    <span>{lang('VERIFICATION_NEW_FAILED')}</span>
                </div>
            }
            default : {
                return ''
            }
        }
    }

    return (
        <PageContainer title={lang(title)} className={'text-center'}>

            <div className="mb-4 text-sm text-gray-600 max-w-lg mx-auto select-none">
                {lang('VERIFICATION_SENT_MSG')}
            </div>

            {getStatus(status)}

            <form onSubmit={submit} className={'flex justify-center items-center gap-x-5 mt-10'}>
                <div className="flex items-center justify-between">

                    <PrimaryButton type={'submit'} processing={processing}>
                        {lang('Resend Verification Email')}
                    </PrimaryButton>

                </div>
                <Link href={route('logout')}
                      method={'post'}
                      as={'button'}>
                    {lang('Log out')}
                </Link>
            </form>
        </PageContainer>
    )
}
