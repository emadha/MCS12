import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarCheck, faCircle, faEdit, faEyeSlash, faTrashCan,
} from '@fortawesome/free-regular-svg-icons'
import { Link, usePage } from '@inertiajs/react'
import { faLink, faMapMarked } from '@fortawesome/free-solid-svg-icons'
import UserLink from '@/Components/User/UserLink'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'
import LikeButton from '@/Components/Actions/LikeButton'
import ContextMenu from '@/Components/ContextMenu'

export default function ListingHead ({ item, className }) {
  const { lang } = useContext(AppContext)
  const auth = usePage().props.auth
  return <div className={'pb-9 ' + (className ? ' ' + className : '')}>


    <div className={'flex flex-wrap justify-between items-stretch'}>
      <div className={'w-full sm:w-1/2 flex'}>
        {false && <h1 className={'text-xl font-medium m-0'}>
          <span>{item.title}</span>
        </h1>}
      </div>
      
    </div>

    <div
      className={'flex flex-wrap items-stretch justify-between w-full mt-3 lg:mt-0 text-xs lg:px-0'}>

      <div
        className={'text-xs flex w-full items-end sm:w-1/2 rounded gap-x-5 ' +
          'dark:mt-2 duration-1000'}>

        <div className={'flex gap-x-1'}>
          {item.shop ? <>
            <FontAwesomeIcon icon={faMapMarked}/>
            <Link href={item.shop.link}>{item.shop.title}</Link>
          </> : <span>{item.user?.name}</span>}
        </div>

        <div className={'flex gap-x-1 items-center select-none'}>
          <FontAwesomeIcon icon={faCircle}/>
          <span>{Intl.NumberFormat('en', { notation: 'compact' }).
            format(item.views)} {lang('Views')}</span>
        </div>

        <div className={'flex gap-x-1 items-stretch select-none'}>
          <span><FontAwesomeIcon icon={faCalendarCheck}/></span>
          <strong>{item.created_at}</strong>
        </div>
      </div>

      <div className={'w-full justify-end text-right sm:w-1/2'}>
        {auth && item.can.edit &&
          <div className={'rounded gap-x-5 flex items-center justify-end'}>
            <ContextMenu h={item.h} className={'text-md'} text={lang('More')}
                         menuClassName={'-full aspect-'}/>
          </div>}

      </div>
    </div>
  </div>
}
