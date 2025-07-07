import React, { useContext } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Menu } from '@headlessui/react'
import { AppContext } from '@/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faExternalLinkAlt, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import DarkModeSwitcher from '@/Components/DarkModeSwitcher'
import { AdminContext } from '@/AdminContext'

export default function Navbar ({
    children, menuItems = [
        { title: '', icon: null, children: [] },
    ],
}) {

    const { lang, darkMode, toggleDarkMode } = useContext(AdminContext)
    const { user } = usePage().props.auth

    const TopBarDropDown = ({ title, children, link }) => <div className={'relative'}>
        <Menu>
            <Menu.Button className={'flex items-center gap-1 p-2 text-sm rounded-lg hover:bg-neutral-800 transition-colors'}>
                {title}
                {children?.length > 0 && <FontAwesomeIcon icon={faChevronDown} size="xs" />}
            </Menu.Button>

            {children?.length > 0 ? (
                <Menu.Items
                    className={'mt-1 bg-grad-secondary absolute w-[200px] p-3 rounded z-[200] shadow-xl text-sm'}>
                    {Object.values(children).map((child, index) =>
                        <Menu.Item key={index} className={'block py-2 hover:bg-white/20 px-5 rounded cursor-pointer transition-all'}>
                            {child}
                        </Menu.Item>
                    )}
                </Menu.Items>
            ) : link ? (
                <Link href={link} className={'block'}>{title}</Link>
            ) : null}
        </Menu>
    </div>

    return <div className={'h-16 px-12 bg-grad-primary shadow w-full fixed top-0 left-0 z-[11]'}>
        <div className={'container h-full'}>
            <div className={'flex items-center justify-between h-full'}>
                <Link href={route('admin.index')} className={'select-none hover:font-black transition-all'}>
                    <span className={'text-2xl'}>MCS<strong className={'font-bold'}>Admin</strong></span>
                </Link>
                <div className={'flex gap-x-2'}>
                    <TopBarDropDown title={lang('Dashboard')} link={route('admin.index')}/>

                    <TopBarDropDown title={lang('Listed Items')}>
                        <Link href={route('admin.index')}>All Items</Link>
                        <Link href={route('admin.index')}>Unapproved</Link>
                        <Link href={route('admin.index')}>Deleted</Link>
                    </TopBarDropDown>

                    <TopBarDropDown title={lang('Shops')}>
                        <Link href={route('admin.index')}>All Shops</Link>
                        <Link href={route('admin.index')}>Pending</Link>
                    </TopBarDropDown>

                    <TopBarDropDown title={lang('Users')}>
                        <Link href={route('admin.index')}>All Users</Link>
                        <Link href={route('admin.index')}>Add New</Link>
                        <Link href={route('admin.index')}>Blocked</Link>
                        <Link href={route('admin.index')}>Unapproved</Link>
                        <Link href={route('admin.index')}>Unverified</Link>
                    </TopBarDropDown>

                    <TopBarDropDown title={lang('Settings')}>
                        <Link href={route('admin.settings.index')}>{lang('Site Settings')}</Link>
                        <Link href={route('admin.sitemap')}>{lang('Sitemap')}</Link>
                        <Link href={route('admin.cars_db.index')}>{lang('Cars Database')}</Link>
                        <Link href={route('admin.index')}>{lang('Regions & Locations')}</Link>
                        <Link href={route('admin.roles_permissions.index')}>{lang('Roles & Permissions')}</Link>
                        <Link href={route('admin.index')}>{lang('Reviews')}</Link>
                        <Link href={route('admin.index')}>{lang('Subscriptions')}</Link>
                    </TopBarDropDown>
                </div>

                <div className={'flex items-center text-sm gap-x-2'}>
                    <DarkModeSwitcher darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
                    <TopBarDropDown title={
                        <div className={'flex items-center overflow-hidden gap-x-2'}>
                            <img
                                src={user.data.profile_picture} alt={user.data.name}
                                className={'block w-8 aspect-square rounded-full bg-white object-cover'}/>
                            <b>{user.data.name}</b>
                        </div>
                    }>
                        <Link href={route('admin.profile')} className={'flex items-center gap-x-2'}>
                            <FontAwesomeIcon icon={faUser} />
                            <span>Edit Profile</span>
                        </Link>
                        <Link method={'post'} href={route('logout')} className={'flex items-center gap-x-2'}>
                            <FontAwesomeIcon icon={faSignOut} />
                            <span>Logout</span>
                        </Link>
                        <a href={route('index')} target={'_blank'} className={'flex items-center gap-x-2 border-t mt-1 pt-1 dark:border-neutral-600'}>
                            <FontAwesomeIcon icon={faExternalLinkAlt}/>
                            <span>View Site</span>
                        </a>
                    </TopBarDropDown>
                </div>
            </div>
        </div>
    </div>
}
