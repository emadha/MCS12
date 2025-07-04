import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faDashboard, faGears, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { Link, usePage } from '@inertiajs/react'
import Hr from '@/Components/Hr'
import { AppContext } from '@/AppContext'
import { AdminContext } from '@/AdminContext'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import OutlineButton from '@/Components/Form/Buttons/OutlineButton'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'

export default function Sidebar ({ className }) {

    const { lang } = useContext(AdminContext)

    const { user } = usePage().props?.auth
    const SidebarBlock = ({ title, children, icon }) => <div>
        {title ? <h3 className={'dark:text-neutral-500'}>{icon ? <FontAwesomeIcon className={'mr-2 rtl:ml-2 rtl:mr-0'} icon={icon}/> : <></>}{title}</h3> : <></>}
        <div className={'list-none select-none p-0'}>
            {children}
        </div>
    </div>

    const SidebarBlockItem = ({ children }) =>
        <div className={'hover:px-4 cursor-pointer dark:hover:text-white transition-all hover:bg-neutral-800 py-2 rounded'}>
            {children}
        </div>

    return <div className={'sticky top-20 w-full text-neutral-800 shadow hover:shadow-lg select-none duration-1000 rounded-lg p-5 bg-white dark:bg-neutral-900 dark:text-neutral-700'}>
        {user?.data ? <div className={'flex p-2 rounded shadow justify-between'}>
            <img src={user.data.profile_picture} alt={user.data.name} className={'bg-neutral-100 rounded w-20 aspect-square -indent-96'}/>

            <div className={'w-full px-2'}>
                <h3 className={'m-0 dark:text-neutral-300'}>{user.data.name}</h3>
                <strong className={'text-xs block'}><FontAwesomeIcon icon={faCrown}/> Super Admin</strong>
            </div>

        </div> : <></>}

        <Hr/>

        <div className={'min-h-[500px] flex flex-wrap content-between'}>

            <div className={'w-full'}>
                <SidebarBlock title={'Listed Items'}>

                    <SidebarBlockItem>
                        <Link href={route('admin.index')}>Dashboard</Link>
                    </SidebarBlockItem>

                </SidebarBlock>

                <SidebarBlock title={'Manage'}>
                    <SidebarBlockItem>
                        <Link href={route('admin.listed.index')} className={'block'}>
                            {lang('Listed Items')}
                        </Link>
                    </SidebarBlockItem>
                    <SidebarBlockItem>
                        <Link href={route('admin.shops.index')} className={'block'}>
                            {lang('Shops')}
                        </Link>
                    </SidebarBlockItem>
                    <SidebarBlockItem>
                        <Link href={route('admin.users.index')} className={'block'}>
                            {lang('Users')}
                        </Link>
                    </SidebarBlockItem>
                    <SidebarBlockItem>
                        <Link href={route('admin.roles_permissions.index')} className={'block'}>
                            {lang('Roles & Permissions')}
                        </Link>
                    </SidebarBlockItem>

                    <SidebarBlockItem>
                        <Link href={route('admin.cars_db.index')} className={'block'}>
                            {lang('Cars Database')}
                        </Link>
                    </SidebarBlockItem>

                </SidebarBlock>
            </div>

            <div className={'flex justify-between flex-wrap w-full'}>
                <SecondaryButton icon={faGears}>
                    <Link href={route('admin.settings.index')}>
                        Site Settings
                    </Link>
                </SecondaryButton>
                <SecondaryButton
                    icon={faSignOut} iconPosition={'end'}>
                    <Link href={route('logout')}
                          method={'post'}
                          as={'button'}>
                        {lang('Log out')}
                    </Link>
                </SecondaryButton>
            </div>
        </div>

    </div>
}
