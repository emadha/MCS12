import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { useForm } from '@inertiajs/react'
import { AppContext } from '@/AppContext'
import { useContext, useEffect, useState } from 'react'
import Alert from '@/Components/Alerts/Alert'
import toast from 'react-hot-toast'

export default function ConfirmForm ({
    className, action, item, onSuccess = () => Function,
}) {
    const { lang, setModalData, setModalShow } = useContext(AppContext)
    const [processing, setProcessing] = useState(true)
    const [wasSuccessful, setWasSuccessful] = useState(null)
    const { data, setData, errors, setError, clearErrors } = useForm({
        to: action,
        h: item.h,
    })

    useEffect(() => {
        setProcessing(false)
    }, [])

    const actionNames = {
        unsend: lang('To Unsend'),
        delete: lang('Delete'),
        mark_as_sold: lang('To Mark as Sold'),
        mark_as_not_sold: lang('To Mark as not Sold'),
        approve: lang('To Approve'),
        disapprove: lang('To Disapprove'),
        publish: lang('To Publish'),
        unpublish: lang('To Unpublish'),
        unlink: lang('Unlink item from shop'),
        link: lang('Link to shop'),
    }[action]

    const submit = (e) => {
        e.preventDefault()
        clearErrors()

        setProcessing(true)

        setModalData({
            content: <Alert contentClassName={'px-10 py-4'} type={'info'}
                            processing={true}>{lang('Updating')}</Alert>,
        })

        axios.post(route('actions.item'), data).then(res => {
            setModalShow(false)
            res.data.status === 1 ?
                toast.success(res.data.message) :
                toast.error(res.data.message)
            onSuccess(res.data.updatedItem)
        }).catch(err => {

            if (err.response) {
                toast.error(err.response.data.message || err.response.statusText)
            }

            setModalShow(false)
        }).finally(() => {
            setModalData({})
            setProcessing(false)
        })
    }
    return <>
        <form onSubmit={submit} className={'p-5'}>
            <input name={'h'} type={'hidden'} value={item.h}/>
            <input name={'_method'} value={'delete'} type={'hidden'}/>
            <div
                className={'flex flex-wrap justify-center gap-y-5 sm:justify-between items-center'}>
                <div className={'text-center sm:w-2/3 w-full'}>
                    <p>{lang('Do you really want to')} <strong className={'font-black'}> {actionNames} </strong> {lang('This', 'Item', '?')}</p>
                </div>
                <div
                    className={'w-full  sm:w-1/3 sm:flex-nowrap flex-wrap flex gap-x-1 justify-center gap-y-2'}>
                    <SecondaryButton onClick={() => setModalShow(false)}>{lang('No')}</SecondaryButton>
                    <PrimaryButton icon={faTrash} type={'submit'}>{lang('Yes')}</PrimaryButton>
                </div>
            </div>
        </form>
    </>
}
