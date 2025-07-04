import { Menu, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react'
import { AppContext } from '@/AppContext'
import Hr from '@/Components/Hr'

export default function ContextMenu ({
    className, text, menuClassName, h, onClick = () => {
    },
}) {
    const [contextMenu, setContextMenu] = useState([])

    const { rtl } = useContext(AppContext)

    const openContextMenu = (open, e, close) => {
        e.stopPropagation()
        // Used to not call axios if you're clicking to close the menu
        if (open) {
            e.preventDefault()
            close()
            return false
        }
        // Set context menu text whilst loading
        setContextMenu([
            {
                title: <div className={'text-center'}>
                    <FontAwesomeIcon className={'text-center'} icon={faSpinner}
                                     spin={true}/>
                </div>,
            },
        ])

        // Get the relevant context menu items
        axios.post(route('contextMenu'), { h: h }).then(response => {
            setContextMenu(response.data)
        }).catch(err => {
            console.error('### Could not fetch context menu')
            setContextMenu(
                [{ title: 'Error', disabled: true, icon: faExclamationTriangle }])
        })

    }

    return <div
        className={'relative z-auto ' + (className ? ' ' + className : '')}>
        {/* Context Menu */}
        <Menu>
            {({ open, close }) => (<>
                <Menu.Button
                    onKeyDown={(e) => openContextMenu(open, e, close)}
                    className={''
                        + (menuClassName ? ' ' + menuClassName : '')
                        +
                        ' group/itemBlock:active:hidden flex items-center gap-x-2 rounded-md hover:shadow duration-100 hover:bg-white hover:dark:bg-neutral-700 !px-5 py-2 space-x-2 ml-0 rtl:mr-0 '
                        + (open ? ' bg-grad-secondary !shadow-lg ' : ' ')
                    }
                    onClick={(e) => openContextMenu(open, e, close)}>
                    <FontAwesomeIcon className={''} icon={faEllipsisV}/>
                    {text ? <span>{text}</span> : <></>}
                </Menu.Button>
                <Transition show={open}
                            className={'absolute right-0 rtl:left-0 rtl:right-auto z-[100000]'}
                            enter={'duration-150'}
                            enterFrom={'opacity-0 top-0 scale-105'}
                            enterTo={'opacity-100 top-11 scale-100'}
                            leave={'duration-100'}
                            leaveFrom={'opacity-100 top-11 scale-100'}
                            leaveTo={'opacity-0 scale-105 top-0'}
                >
                    <Menu.Items
                        className={'min-w-[170px] z-10 mt-0.5 shadow-lg bg-grad-secondary dark:text-neutral-200 rounded overflow-hidden '
                            + 'text-sm text-right flex flex-wrap font-normal  '
                        }>
                        {contextMenu.length ? contextMenu.map(
                            contextMenuItem => contextMenuItem.title === '-'
                                ? <div key={h + contextMenuItem.title} className={'w-full clear-both'}><Hr className={'!my-1'}/></div>
                                : <Menu.Item
                                    disabled={contextMenuItem.disabled ?? false}
                                    key={contextMenuItem.title}
                                    className={'w-full'}>
                                    {({ active, disabled }) =>
                                        <div onClick={() => onClick(contextMenuItem.action_id)}
                                             className={`select-none cursor-pointer px-5 py-2 flex items-end justify-end group/itemBlockItem
                                          ${active && ' text-white bg-indigo-500 '}
                                          ${disabled && ' opacity-20 !cursor-default '}
                                       `}
                                             data-action-id={contextMenuItem.action_id}
                                             key={contextMenuItem.title}
                                        >
                                            {contextMenuItem.title}
                                            {contextMenuItem.icon
                                                ? <span
                                                    onClick={() => onClick(contextMenuItem.action_id)}
                                                    className={(rtl ? 'mr-1' : 'ml-1') +
                                                        ' text-xs dark:text-neutral-400 w-0 overflow-hidden transition-all group-hover/itemBlockItem:w-3'}
                                                    dangerouslySetInnerHTML={{ __html: contextMenuItem.icon }}/>
                                                : <></>
                                            }
                                        </div>
                                    }
                                </Menu.Item>) : <></>}
                    </Menu.Items>
                </Transition>
            </>)}
        </Menu>
    </div>
}
