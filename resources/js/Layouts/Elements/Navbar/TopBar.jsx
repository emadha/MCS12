import MyCars from '@/Components/User/MyCars'
import { Link, usePage } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'
import ShopsContainer from '@/Components/Shops/ShopsContainer'
import LoginComponent from '@/Components/LoginComponent'

export default function TopBar ({ className, children }) {
  const { lang, wLogout } = useContext(AppContext)
  const { user } = usePage().props.auth

  return <div
    className={'container transition-all overflow-auto max-h-[75vh] py-5 lg:px-10 bg-white dark:bg-neutral-900'}>
    {user
      ? <div className={'flex p-5 flex-wrap items-stretch justify-center'}>
        <div className={'lg:w-3/12 w-full text-center lg:sticky top-12 flex justify-center items-start rtl:pl-5 rtl:pr-0 pr-5 '}>
          <div className={'w-full flex items-center flex-wrap justify-center'}>
            {user && <>
              <Link className={'flex justify-between w-full dark:hover:bg-neutral-800 rounded p-2'}
                    href={route('user.single', user.data.id)}>

                <div className={'w-36 h-36 p-1 flex items-center justify-center rounded-full dark:bg-black'}>
                  {user.data.profile_picture ? <img className={'w-36 h-32 object-cover rounded-full'} src={user.data.profile_picture} alt=""/> :
                    <FontAwesomeIcon icon={faUser} className={'text-5xl'}/>}</div>
                <div className={'p-2'}>
                  <h4 className={'block text-3xl items-center space-x-2 justify-center'}>
                        <span
                          className={'dark:text-neutral-200'}>{user.data.name}</span>
                  </h4>
                  <small className={'w-full block -mt-3.5  text-xs text-neutral-500'}>
                    {user.data.email}
                  </small>
                </div>
              </Link>

              <div className={'w-full'}>


                <div className={'flex flex-wrap mt-7 text-left rtl:text-right'}>
                  <Link className={'w-full py-3 dark:hover:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded transition-all px-4'}
                        href={route('profile.edit')}>
                    <FontAwesomeIcon icon={faUserEdit} className={'mr-2'}/>
                    {lang('Edit Profile')}
                  </Link>
                  <Link
                    href={route('logout')}
                    method={'post'}
                    className={'w-full py-3 dark:hover:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded transition-all px-4'}
                    onClick={wLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className={'rtl:ml-2 mr-2'}/>
                    {lang('Log out')}
                  </Link>
                </div>
              </div>
            </>}
          </div>

        </div>

        <div className={'lg:w-9/12 w-full space-y-5'}>
          <ShopsContainer shops={user.data.shops}/>
          <MyCars/>
        </div>
      </div>
      : <LoginComponent/>
    }
  </div>
}
