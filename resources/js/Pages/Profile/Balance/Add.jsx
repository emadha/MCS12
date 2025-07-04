import PageContainer from '@/Layouts/PageContainer'
import TextInput from '@/Components/Form/TextInput'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { useContext, useState } from 'react'
import Field from '@/Components/Form/Field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faExclamationTriangle, faLaptopCode, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Transition } from '@headlessui/react'
import { faStripe } from '@fortawesome/free-brands-svg-icons'
import AppLink from '@/Components/AppLink'
import Hr from '@/Components/Hr'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { AppContext } from '@/AppContext'

export default function Add ({ title, credits = [] }) {
    const {lang} = useContext(AppContext)
    const [amount, setAmount] = useState(0)
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState([])
    const submit = (e) => {

        e.preventDefault()
        setErrors([])
        setProcessing(true)

        axios.post(route('balance.add.post'), { amount: amount }).then(res => {

        }).catch(err => {
            setErrors(Object.values(err.response.data))
        }).finally(() => {
            setProcessing(false)
        })

    }

    return <PageContainer title={title} className={'px-10 !max-w-[800px] rounded-xl shadow bg-grad-primary'}>
        <form onSubmit={submit}>

            <Transition show={errors.length ? true : false}
                        enter={'duration-200'}
                        enterFrom={'opacity-0'}
                        enterTo={'opacity-100'}
                        leave={'duration-200'}
                        leaveFrom={'opacity-100'}
                        leaveTo={'opacity-0'}>
                {errors.length ? <div className={'p-3 rounded text-white shadow bg-red-500 flex items-center'}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={'text-sm mr-2 animate-pulse'}/>
                    {errors.map(err => <div>{err.amount}</div>)}
                </div> : <></>}
            </Transition>


            <Field>
                <p>Credits are used to make transactions on this website, such as posting cars or creating showrooms.
                    &nbsp; see pricing below for more details:
                </p>

                <table className={'table w-full dark:bg-neutral-800 rounded mt-10'}>
                    <tbody>
                    {Object.entries(credits).map(row => <tr>
                        <td className={'py-2 px-5 space-x-2'}>
                            <FontAwesomeIcon icon={faPlusSquare} className={'cursor-pointer'} title={lang('Add')}/>
                            <span>{row[0]}</span>
                        </td>
                        <td className={'text-right px-5'}>
                            {row[1]} points
                        </td>
                    </tr>)}
                    </tbody>
                </table>
            </Field>

            <div className={'flex flex-wrap mx-auto mt-20'}>
                <TextInput name={'amount'} type={'number'}
                           clearable={true}
                           className={(processing ? 'w-3/6' : 'w-4/6') + ' transition-all'}
                           disabled={processing}
                           min={1}
                           handleChange={(e) => setAmount(e.target.value)}
                           placeholder={'Amount to add, min 1'}/>


                <div className={(processing ? 'w-3/6' : 'w-2/6') + ' transition-all px-2'}>
                    <PrimaryButton
                        className={'w-full h-full'}
                        disabled={processing}
                        processing={processing}
                        type={'submit'}>Next, Payment method <FontAwesomeIcon icon={faCaretRight}/></PrimaryButton>
                </div>

                <Field>
                    <i>We currently only accept Cash and <FontAwesomeIcon icon={faStripe}/> at the moment,
                        we will be working on adding more payment methods soon.</i>

                    <Hr/>
                    <AppLink href={route('balance.redeem')}>
                        <SecondaryButton className={'mx-auto my-10'} size={'lg'}>
                            Redeem Coupon code
                        </SecondaryButton>
                    </AppLink>

                </Field>

            </div>

        </form>
    </PageContainer>
}
