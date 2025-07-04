import React, { useContext } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Menu } from '@headlessui/react'
import { AppContext } from '@/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faExternalLinkAlt, faSignOut } from '@fortawesome/free-solid-svg-icons'
import Hr from '@/Components/Hr'
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
        <Menu __demoMode={false}>
            <Menu.Button className={'flex items-center text-sm rounded-lg hover:bg-neutral-800'}>

            </Menu.Button>

            {children?.length > 0 ? <Menu.Items
                className={'mt-1 bg-grad-secondary absolute w-[200px] p-3 rounded z-[200] shadow-xl text-sm text-sm'}>
                {Object.values(children).map(child =>
                    <Menu.Item className={'block py-2 hover:bg-white/20 px-5 rounded cursor-pointer transition-all'}>
                        {child}
                    </Menu.Item>)}
            </Menu.Items> : <></>}
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
                        <div>Unapproved</div>
                        <div>Deleted</div>
                    </TopBarDropDown>

                    <TopBarDropDown title={lang('Shops')}>

                    </TopBarDropDown>

                    <TopBarDropDown title={lang('Users')}>
                        <Link href={''}>Users</Link>
                        <Link href={''}>Add</Link>
                        <Link href={''}>Blocked</Link>
                        <Link href={''}>Unapproved</Link>
                        <Link href={''}>Unverified</Link>
                    </TopBarDropDown>

                    <TopBarDropDown title={lang('Settings')}>
                        <Link href={route('admin.settings.index')}>{lang('Site Settings')}</Link>
                        <Link href={route('admin.sitemap')}>{lang('Sitemap')}</Link>
                        <Link href={route('admin.cars_db.index')}>{lang('Cars Database')}</Link>
                        <div>{lang('Regions & Locations')}</div>
                        <Link href={route('admin.roles_permissions.index')}>{lang('Roles & Permissions')}</Link>
                        <div>{lang('Reviews')}</div>
                        <div>{lang('Subscriptions')}</div>
                    </TopBarDropDown>
                </div>

                <div className={'flex items-center text-sm gap-x-2'}>
                    <DarkModeSwitcher darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
                    <TopBarDropDown title={<div className={'flex items-center overflow-hidden gap-x-2'}>
                        <img
                            src={user.data.profile_picture} alt={user.data.name}
                            className={'block -indent-96 w-8 aspect-square rounded-full bg-white'}/>
                        <b>{user.data.name}</b>
                    </div>}>
                        <Link method={'post'} href={(route('logout'))} target={'_blank'}
                              className={'space-x-1'}>
                            Edit Profile
                        </Link>
                        <Link method={'post'} href={(route('logout'))} target={'_blank'}
                              className={'space-x-1'}>
                            Logout
                        </Link>
                        <a href={route('index')} target={'_blank'} className={'space-x-1 border-t mt-1 dark:border-neutral-600'}>
                            <span>Site</span>
                            <FontAwesomeIcon icon={faExternalLinkAlt}/>
                        </a>
                    </TopBarDropDown>

                </div>
            </div>
        </div>
    </div>
}
