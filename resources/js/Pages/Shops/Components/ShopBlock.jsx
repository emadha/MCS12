import {Link, router, usePage} from '@inertiajs/react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCube, faListDots} from '@fortawesome/free-solid-svg-icons'
import ContextMenu from '@/Components/ContextMenu'
import {AppContext} from '@/AppContext'
import ConfirmForm from '@/Components/Forms/ConfirmForm'
import ReportForm from '@/Components/Forms/ReportForm'
import {useContext, useState} from 'react'
import LikeButton from '@/Components/Actions/LikeButton'

export default function ShopBlock({_k, className, shop}) {

    const {lang, setModalData, setModalShow} = useContext(AppContext)

    const [loadedShop, setLoadedShop] = useState(shop)

    const {user} = usePage().props.auth

    const updateShop = (updatedItem) => {
        setLoadedShop(updatedItem)
    }

    const contextOnClick = (action, e) => {

        switch (action) {
            case 'delete': {
                setModalData({
                    content: <ConfirmForm onSuccess={() => setLoadedShop(false)} action={'delete'} item={loadedShop}/>,
                })
                setModalShow(true)
                break
            }
            case 'edit': {
                router.visit(route('shop.single.edit', loadedShop.id))
                break
            }
            case 'disapprove':
            case 'approve': {
                setModalData({
                    content: <ConfirmForm onSuccess={updateShop} action={action} item={loadedShop}/>,
                })
                setModalShow(true)
                break
            }
            case 'report': {
                setModalShow(true)

                setModalData({
                    title: lang('Report'), content: <ReportForm h={loadedShop.h}/>,
                })
                break
            }

            default:
                console.log('Unknown context action:' + action)
        }
    }
    return loadedShop ?
        <div className={'h-full relative'}>
            <Link href={loadedShop.link}
                  className={'bg-background '
                      + 'transition-all shadow-sm rounded group/shopBlocks hover:scale-105 '
                      + 'hover:bg-indigo-50 dark:hover:bg-neutral-700/20 hover:shadow-md border border-transparent '
                      + (loadedShop.is_approved ? ' ' : ' border-red-500/20 ')}>

                <div className={'flex items-center justify-center'}>
                    {loadedShop.primary_photo ?
                        <img src={loadedShop.primary_photo.path.square_sm}
                             className={'object-cover w-full rounded dark:bg-neutral-900/50 block h-full border-none '}
                             alt={' '}/>
                        :
                        <div className={'flex items-center justify-center h-full dark:text-neutral-700 animate-pulse'}>
                            <FontAwesomeIcon icon={faCube}/>
                        </div>}
                </div>

                <div>
                    <h5 className={'w-full px-3 m-0'}>{loadedShop.title}</h5>
                    <span className={'text-xs gap-x-1 items-center justify-start flex'}>
                        <LikeButton item={loadedShop}/>
                    </span>
                    <span className={'text-xs gap-x-1 items-center justify-start flex'}>
                        <FontAwesomeIcon icon={faListDots} className={'opacity-70'}/>{loadedShop.listings_count}
                    </span>
                </div>
            </Link>
            <ContextMenu className={'!absolute top-2 right-2 w-30'} h={loadedShop.h} onClick={contextOnClick}/>
        </div> : <></>
}
