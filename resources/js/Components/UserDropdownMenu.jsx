import React, { useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { Link, useForm } from '@inertiajs/react'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import Hr from '@/Components/Hr'

export default function UserDropdownMenu ({ k, user }) {
    const [processing, setProcessing] = useState(true)
    const { post } = useForm()

    const LinkMenuItem = ({
        as, title, href, method, icon, onClick = () => {},
        className = 'flex justify-end gap-x-2 items-center hover:bg-black text-xs hover:text-white px-7 sm:py-3 ',
        rawIcon,
    }) => <Menu.Item
        className={'w-full py-3'}>
        {({ active }) =>
            as === 'a'
                ? <a onClick={onClick}
                     href={href}
                     className={className + (active ? ' bg-black text-white' : '')}
                     target={'_blank'}>
                    <span>{title}</span>
                    {rawIcon
                        ? <svg dangerouslySetInnerHTML={{ __html: rawIcon }} className={'w-3 aspect-square'}/>
                        : <FontAwesomeIcon className={'w-3 aspect-square'} icon={icon}/>}
                </a>
                : <Link href={href}
                        onClick={onClick}
                        target={'_blank'}
                        as={as}
                        method={method}
                        className={className + (active ? ' bg-black text-white ' : '')}>
                    <span>{title}</span>
                    {rawIcon
                        ? <svg dangerouslySetInnerHTML={{ __html: rawIcon }} className={'w-3 aspect-square'}/>
                        : <FontAwesomeIcon className={'w-3 aspect-square'} icon={icon}/>}
                </Link>}
    </Menu.Item>

    return <div key={k} className={'group/navUserLink'}>
        <Menu>{({ open }) => <div className={'relative'}>
            <Menu.Button>
                <div
                    className={'rounded-lg transition-all cursor-pointer py-2 ' +
                        'group-hover/navUserLink:text-white px-5 flex items-center gap-x-2 ' +
                        (open ? ' py-2 bg-black text-white shadow-xl ' : ' group-hover/navUserLink:bg-black/80 ')}>
                    <div className={'relative w-6 aspect-square'}>
                        {user.data.nofications
                            ? <div
                                className={'absolute -top-2 -right-2 z-50 bg-red-600 text-xs rounded-xl py-0.5 px-2 shadow font-black text-white'}>
                                {user.data.notifications.count}

                            </div>
                            : <></>}

                        {user.data.profile_picture
                            ? <img
                                className={'rounded-full transition-all h-full aspect-square m-0 object-cover shadow'}
                                src={user.data.profile_picture}/>
                            : <FontAwesomeIcon className={'mt-1.5'} icon={faUser}/>}
                    </div>
                    <span>{user.data.name}</span>
                </div>
            </Menu.Button>
            <div className={'absolute right-0 rtl:left-0 rtl:right-auto z-[100000] text-lg lg:text-sm'}>

                <Menu.Items
                    modal={false}
                    className={'mt-1 bg-grad-secondary shadow-xl overflow-hidden rounded-lg flex justify-end flex-wrap text-sm'}>

                    {user.data.contextMenu.map((contextMenu, i) =>
                        <div key={i} className={'w-full'}>
                            {contextMenu === '-'
                                ? <Hr k={contextMenu.href} className={'!my-0.5'}/>
                                : <LinkMenuItem
                                    k={contextMenu.href}
                                    title={contextMenu.title}
                                    as={contextMenu.as}
                                    href={contextMenu.href} rawIcon={contextMenu.icon}/>}
                        </div>)}

                    <Hr className={'!my-0'}/>
                    <LinkMenuItem title={'Logout'}
                                  onClick={(e) => e.preventDefault() || post(route('logout'))}
                                  method={'post'}
                                  icon={faSignOut}/>
                </Menu.Items>
            </div>

        </div>}
        </Menu>
    </div>
}
