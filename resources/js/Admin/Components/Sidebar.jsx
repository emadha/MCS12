import React, { useContext, memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faGears, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { Link, usePage } from '@inertiajs/react'
import Hr from '@/Components/Hr'
import { AdminContext } from '@/AdminContext'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'

    const SidebarBlock = memo(({ title, children, icon }) => (
    <div>
        {title && (
            <h3 className={'dark:text-neutral-500'}>
                {icon && <FontAwesomeIcon className={'mr-2 rtl:ml-2 rtl:mr-0'} icon={icon} />}
                {title}
            </h3>
        )}
        <div className={'list-none select-none p-0'}>{children}</div>
    </div>
    ))

    const SidebarBlockItem = memo(({ children }) => (
    <div className={'hover:px-4 cursor-pointer dark:hover:text-white transition-all hover:bg-neutral-800 py-2 rounded'}>
        {children}
    </div>
    ))

    const Sidebar = ({ className }) => {
    const { lang } = useContext(AdminContext)
    const { user } = usePage().props?.auth

    return (
        <div className={'sticky top-20 w-full text-neutral-800 shadow hover:shadow-lg select-none duration-1000 rounded-lg p-5 bg-white dark:bg-neutral-900 dark:text-neutral-700'}>
            {user?.data && (
                <div className={'flex p-2 rounded shadow justify-between'}>
                    <img
                        src={user.data.profile_picture}
                        alt={user.data.name}
                        className={'bg-neutral-100 rounded w-20 aspect-square -indent-96'}
                        loading="lazy"
                    />
                    <div className={'w-full px-2'}>
                        <h3 className={'m-0 dark:text-neutral-300'}>{user.data.name}</h3>
                        <strong className={'text-xs block'}>
                            <FontAwesomeIcon icon={faCrown}/> Super Admin
                        </strong>
                    </div>
                </div>
            )}

            <Hr/>

            <div className={'min-h-[500px] flex flex-wrap content-between'}>
                <div className={'w-full'}>
                    <SidebarBlock title={'Listed Items'}>
                        <SidebarBlockItem>
                            <Link href={route('admin.index')}>Dashboard</Link>
                        </SidebarBlockItem>
                    </SidebarBlock>

                    <SidebarBlock title={'Manage'}>
                        {[
                            { route: 'admin.listed.index', label: 'Listed Items' },
                            { route: 'admin.shops.index', label: 'Shops' },
                            { route: 'admin.users.index', label: 'Users' },
                            { route: 'admin.roles_permissions.index', label: 'Roles & Permissions' },
                            { route: 'admin.cars_db.index', label: 'Cars Database' }
                        ].map((item, index) => (
                            <SidebarBlockItem key={index}>
                                <Link href={route(item.route)} className={'block'}>
                                    {lang(item.label)}
                                </Link>
                            </SidebarBlockItem>
                        ))}
                    </SidebarBlock>
                </div>

                <div className={'flex justify-between flex-wrap w-full'}>
                    <SecondaryButton icon={faGears}>
                        <Link href={route('admin.settings.index')}>Site Settings</Link>
                    </SecondaryButton>
                    <SecondaryButton icon={faSignOut} iconPosition={'end'}>
                        <Link href={route('logout')} method={'post'} as={'button'}>
                            {lang('Log out')}
                        </Link>
                    </SecondaryButton>
                </div>
            </div>
        </div>
    )
}
