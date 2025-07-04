import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faChain, faTrash } from '@fortawesome/free-solid-svg-icons'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { useForm } from '@inertiajs/react'
import { AppContext } from '@/AppContext'
import { useContext, useEffect, useState } from 'react'
import Alert from '@/Components/Alerts/Alert'
import toast from 'react-hot-toast'
import MyShowroomSelect from '@/Components/User/Widgets/ShowroomSelect'
import Hr from '@/Components/Hr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ShopLinkDialogue ({
    className, action, item, onSuccess = () => Function, usedShowroomID
}) {
    const { lang, setModalData, setModalShow } = useContext(AppContext)
    const [processing, setProcessing] = useState(true)
    const [wasSuccessful, setWasSuccessful] = useState(null)
    const [selectedShowroom, setSelectedShowroom] = useState(null)
    const {
        data, setData,
        isDirty,
        errors, setError, clearErrors,
    } = useForm({
        to: action,
        h: item.h,
        shop_id: usedShowroomID,
    })

    useEffect(() => {
        setProcessing(false)
    }, [])

    const actionNames = {
        shop_link: lang('Shop Link'),
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
                toast.error(err.response.statusText)
            }

            setModalShow(false)
        }).finally(() => {
            setModalData({})
            setProcessing(false)
        })
    }

    const handleShowroomSelect = (e) => {
        setSelectedShowroom(e?.value)
    }

    useEffect(() => {
        setProcessing(true)
        axios.get(route('api.listing.shop', { h: item.h })).then(res => {
            setSelectedShowroom(res.data?.selected_showroom ?? null)
        }).finally(() => setProcessing(false))
    }, [item.h])

    useEffect(() => {
        setData('shop_id', selectedShowroom)
    }, [selectedShowroom])

    return <>
        <form onSubmit={submit} className={'p-5 lg:p-10'}>
            <input name={'h'} type={'hidden'} value={item.h}/>

            <>
                <h3 className={'my-0 mb-5'}>
                    <FontAwesomeIcon icon={faChain} className={'mr-1'}/>
                    <span className={'inline-block'}>Link to Shop</span>
                </h3>

                <div
                    className={'flex flex-wrap justify-center gap-y-5 sm:justify-between items-end'}>

                    <div className={'sm:w-2/3 w-full'}>
                        <p className={'text-xs'}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum explicabo fugit incidunt odit provident! Culpa ducimus esse fugit harum impedit
                            libero, nisi porro quaerat quis reiciendis? Fugit illum laborum non!</p>
                        <Hr/>

                        {processing
                            ? <></>
                            : <MyShowroomSelect name={'shop_id'} onChange={handleShowroomSelect} defaultValue={selectedShowroom}/>}
                    </div>

                    <div
                        className={'w-full  sm:w-1/3 sm:flex-nowrap flex-wrap flex gap-x-1 justify-center gap-y-2'}>
                        <SecondaryButton onClick={() => setModalShow(false)}>{lang('No')}</SecondaryButton>
                        <PrimaryButton disabled={!isDirty} icon={faTrash} type={'submit'}>{lang('Yes')}</PrimaryButton>
                    </div>
                </div>

            </>
        </form>
    </>
}
