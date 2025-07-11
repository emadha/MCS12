import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisV, faExclamationTriangle, faSpinner} from '@fortawesome/free-solid-svg-icons';
import {useContext, useState} from 'react';
import {AppContext} from '@/AppContext';
import Hr from '@/Components/Hr';
import {clsx} from 'clsx';

export default function ContextMenu({
    className,
    text,
    menuClassName,
    h,
    onClick = () => {},
}) {
    const [contextMenu, setContextMenu] = useState([]);
    const {rtl} = useContext(AppContext);

    const openContextMenu = (open, e, close) => {



        try {
            // Get the relevant context menu items
            axios.post(route('contextMenu'), {h: h}).then(response => {
                setContextMenu(response.data);
            }).catch(err => {
                console.error('### Could not fetch context menu');
            });
        } catch (e) {
            setContextMenu(
                [
                    {
                        title: 'Error',
                        disabled: true,
                        icon: faExclamationTriangle,
                    }]);
        }

    };


    return <>
        <div
            className={'relative z-auto ' + (className ? ' ' + className : '')}>
            {/* Context Menu */}
            <Menu>
                {({open, close}) => (<>
                    <MenuButton
                        as={'button'}
                        className={clsx(
                            'w-10 aspect-square focus:!outline-none hover:bg-white/5 transition-all duration-2000',
                            open
                                ? '!bg-white/20'
                                : '')}
                        onClick={(e) => openContextMenu(open, e, close)}>
                        <FontAwesomeIcon className={'text-base'}
                                         icon={faEllipsisV}/>
                        {text ? <span>{text}</span> : <></>}
                    </MenuButton>
                    <MenuItems
                        transition
                        modal={false}
                        anchor={'bottom end'}
                        className="z-[1000] w-40 mt-1 origin-top-right glass p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0">
                        {contextMenu.length ? contextMenu.map(
                            contextMenuItem => contextMenuItem.title === '-'
                                ? <div key={contextMenuItem.title + Math.random()}
                                       className={'w-full clear-both'}><Hr
                                    className={'!my-1'}/></div>
                                : <MenuItem
                                    disabled={!!contextMenuItem.disabled}
                                    key={contextMenuItem.title + Math.random()}
                                    className={'w-full flex items-center gap-x-1 justify-between flex-row-reverse'}>
                                    {({active, disabled}) =>
                                        <div onClick={() => onClick(
                                            contextMenuItem.action_id)}
                                             className={`select-none dark:text-white text-black opacity-60 transition-all hover:opacity-100 cursor-pointer px-5 py-2 flex items-end justify-end group/itemBlockItem
                                          ${active &&
                                             ' text-white bg-indigo-500 '}
                                          ${disabled &&
                                             ' opacity-20 !cursor-default '}
                                       `}
                                             data-action-id={contextMenuItem.action_id}
                                             key={contextMenuItem.title}
                                        >
                                            {contextMenuItem.title}
                                            {contextMenuItem.icon
                                                ? <span
                                                    onClick={() => onClick(
                                                        contextMenuItem.action_id)}
                                                    className={(rtl
                                                            ? 'mr-1'
                                                            : 'ml-1') +
                                                        ' text-xs dark:text-white opacity-50 w-0 overflow-hidden transition-all group-hover/itemBlockItem:w-3'}
                                                    dangerouslySetInnerHTML={{__html: contextMenuItem.icon}}/>
                                                : <></>
                                            }
                                        </div>
                                    }
                                </MenuItem>) : <></>}
                    </MenuItems>
                </>)}
            </Menu>
        </div>
    </>;
}
