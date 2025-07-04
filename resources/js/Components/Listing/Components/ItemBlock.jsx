import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAd, faDollar, faFileImage, faMapMarkerAlt, faShop, faStopCircle, faUser } from '@fortawesome/free-solid-svg-icons'
import { faClipboard } from '@fortawesome/free-regular-svg-icons'
import { Link, router } from '@inertiajs/react'
import LikeButton from '@/Components/Actions/LikeButton'
import { useContext } from 'react'
import { Skeleton } from 'antd'
import ContextMenu from '@/Components/ContextMenu'
import { AppContext } from '@/AppContext'
import ReportForm from '@/Components/Forms/ReportForm'
import ConfirmForm from '@/Components/Forms/ConfirmForm'
import { ListingContext } from '@/Context/ListingContext'
import toast from 'react-hot-toast'
import ShopLinkDialogue from '@/Components/Forms/ShopLinkDialogue'

export default function ItemBlock ({ k, className, children, item, view = 'grid', sidebarOpen, showMenu = true }) {

    const { setModalShow, setModalData, rtl, lang } = useContext(AppContext)

    const { removeListingItem, updateListingItem } = useContext(ListingContext)

    const itemViewClass = () => {
        switch (view) {
            case 'grid':
                return ' w-full ' + (!sidebarOpen ? 'lg:w-1/3' : 'lg:w-1/3') + ' '
            case 'wide_sm':
                return ' w-1/3 '
            default:
                return ' w-full'
        }
    }

    const contextOnClick = (action) => {
        if (!showMenu) {
            return
        }

        switch (action) {
            case 'delete': {
                setModalData({
                    content: <ConfirmForm onSuccess={() => removeListingItem(item.id)} action={'delete'} item={item}/>,
                })
                setModalShow(true)
                break
            }
            case 'edit': {
                router.visit(route('listing.single.edit', item.id))
                break
            }
            case 'disapprove':
                setModalData({
                    content: <ConfirmForm onSuccess={updateListingItem} action={action} item={item}/>,
                })
                setModalShow(true)
                break
            case 'approve': {
                setModalData({
                    content: <ConfirmForm onSuccess={updateListingItem} action={action} item={item}/>,
                })
                setModalShow(true)
                break
            }

            case 'mark_as_not_sold':
            case 'mark_as_sold': {
                setModalData({
                    content: <ConfirmForm onSuccess={updateListingItem} action={action} item={item}/>,
                })
                setModalShow(true)
                break
            }

            case 'shop_link': {
                setModalData({
                    content: <ShopLinkDialogue usedShowroomID={item.shop_id} onSuccess={updateListingItem} action={action} item={item}/>,
                })
                setModalShow(true)
                break
            }

            case 'report': {
                setModalShow(true)

                setModalData({
                    title: lang('Report'), content: <ReportForm h={item.h}/>,
                })
                break
            }

            case 'copy_permalink': {
                navigator.clipboard.writeText(item.permalink).then(
                    () => toast.success(lang('Link copied!'), {
                        icon: <FontAwesomeIcon icon={faClipboard}/>, className: 'toast_success',
                    }),
                ).catch(
                    () => toast.error(lang('Could not copy link')),
                )
                break
            }

            default:
                console.log('Unknown context action:' + action)
        }
    }

    const PromotedBadge = () => {
        return <div className={'text-xl font-black text-lime-500 mix-blend-difference z-10 shadow-sm pl-2 rounded rounded-l-none ' + 'opacity-90 absolute origin-top-left'}>
            <FontAwesomeIcon icon={faAd}/></div>
    }

    const SoldBadge = () => {
        return <div className={'text-xs font-black left-5 top-3 bg-black/80 border border-neutral-600 z-10 shadow-sm rounded p-1 px-2 opacity-90 absolute'}>
            <FontAwesomeIcon icon={faStopCircle}/> Sold</div>
    }
    const renderBlock = () => {
        return <div className={'group/itemBlock relative'}>
            {item.promoted && <PromotedBadge/>}

            {item.sold_at ? <SoldBadge/> : <></>}
            <Link href={item.link}
                  as={'a'}
                  className={'l-i-single @container ' + (item.sold_at ? ' !opacity-20 !cursor-default ' : '') +
                      (item.is_approved ? ' ' : ' !ring-red-900 opacity-70 ')
                      + (view === 'grid' ? ' ' : ' @lg:flex-nowrap sm:h-72')}
                  tabIndex={1}>
        <span className={'h-full bg-neutral-200 dark:bg-neutral-800 rounded relative w-full '}>
          <span className={'w-full h-full'}>
            {item.primary_photo ? <img
                className={'h-full -indent-[90000px] w-full object-cover select-none aspect-square !border-none '}
                src={item.primary_photo.path.wide_md}
                alt={item.title}/> : <span
                className={'w-full h-full aspect-square flex items-center  justify-center text-6xl text-neutral-300 dark:text-neutral-700'}>
                <FontAwesomeIcon icon={faFileImage}/>
              </span>}
              <h2 className={'z-[2] absolute bottom-10 left-2 bg-green-600 text-white rounded-xl shadow-xl px-5 py-1 pb-2'}>
              <FontAwesomeIcon icon={faDollar} className={'mr-1 text-sm'}/>
                  {item.price}
                  <div className={'relative'}><img className={'absolute -bottom-5 -left-4'} src={'/res/mcs.svg'}/></div>
            </h2>

              {item.location ? <span className={'absolute top-5 left-5 bg-white dark:bg-black rounded px-2 pb-1'}>
              <FontAwesomeIcon className={'text-lime-700'} icon={faMapMarkerAlt}/>
              <span className={'text-left px-2'}>{lang(item.location.name)}</span>
            </span> : <></>}
          </span>

          <span className={'absolute bottom-0 drop-shadow text-white bg-gradient-to-t to-transparent from-black py-4 px-5 w-full flex flex-wrap items-center justify-between text-sm'}>

            <span className={'w-2/3 whitespace-nowrap text-ellipsis block overflow-hidden'}>
              {item.shop
                  ? <Link as={'div'} href={route('shop.single', item.shop.id)}>
                      <FontAwesomeIcon icon={faShop} className={'mr-1'}/>
                      {item.shop.title}
                  </Link>
                  : <>
                      {
                          item.user
                              ? <span className={'flex gap-x-2 items-center'}>
                                  {item.user.profile_picture
                                      ? <img src={item.user.profile_picture} className={'w-7  object-cover aspect-square rounded-full'} alt={item.user.name}/>
                                      : <FontAwesomeIcon icon={faUser}/>
                                  }
                                  <strong className={'text-xs font-black py-1'}>{item.user.name}</strong>
                                </span>
                              : <>-</>
                      }
                  </>
              }
            </span>
          </span>
        </span>
                <span className={'flex flex-wrap justify-between items-center pb-5 w-full'}>
          <span className={'px-5'}>{children}</span>
        </span>
            </Link>

            <div className={'font-black dark:text-white gap-x-2 w-full px-5 items-center flex justify-between'}>
                <div
                    className={'absolute ' + (rtl ? 'left-3' : 'right-3') + ' top-3 transition-all rounded-xl flex gap-x-2 rtl:flex-wrap-reverse items-center justify-end'}>
                    <LikeButton item={item} className={'text-2xl'}/>
                    <ContextMenu h={item.h} onClick={contextOnClick}/>
                </div>
            </div>
        </div>
    }
    return <div key={k} className={'relative transition-all p-2 xl:px-2.5 px-5 sm:py-3' + (className ? ' ' + className : '') + itemViewClass()}>
        {item ? renderBlock() : <><Skeleton active={true} className={'w-full h-full'}/></>}
    </div>
}

