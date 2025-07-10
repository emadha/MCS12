import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faEllipsisV,
    faExclamationTriangle,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import {useContext, useState} from 'react';
import {AppContext} from '@/AppContext';
import Hr from '@/Components/Hr';

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

        e.stopPropagation();
        // Used to not call axios if you're clicking to close the menu

        // Set context menu text whilst loading
        setContextMenu([
            {
                title: <div className={'text-center'}>
                    <FontAwesomeIcon className={'text-center'} icon={faSpinner}
                                     spin={true}/>
                </div>,
            },
        ]);

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

    return <div
        className={'relative z-auto ' + (className ? ' ' + className : '')}>
        {/* Context Menu */}
        <Menu>
            {({open, close}) => (<>
                <MenuButton
                    className="sinline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700"
                    onClick={(e) => openContextMenu(open, e, close)}>
                    <FontAwesomeIcon className={''} icon={faEllipsisV}/>
                    {text ? <span>{text}</span> : <></>}
                </MenuButton>
                <Transition show={open}
                            className={'absolute right-0 rtl:left-0 rtl:right-auto z-[100000]'}
                            enter={'duration-150'}
                            enterFrom={'opacity-0 top-0 scale-105'}
                            enterTo={'opacity-100 top-11 scale-100'}
                            leave={'duration-100'}
                            leaveFrom={'opacity-100 top-11 scale-100'}
                            leaveTo={'opacity-0 scale-105 top-0'}
                >
                    <MenuItems
                        anchor={'bottom end'}
                        className="w-52 origin-top-right rounded-xl border border-white/5 glass p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0">
                        {contextMenu.length ? contextMenu.map(
                            contextMenuItem => contextMenuItem.title === '-'
                                ? <div key={h + contextMenuItem.title}
                                       className={'w-full clear-both'}><Hr
                                    className={'!my-1'}/></div>
                                : <MenuItem
                                    disabled={contextMenuItem.disabled ?? false}
                                    key={contextMenuItem.title}
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
                </Transition>
            </>)}
        </Menu>
    </div>;
}
