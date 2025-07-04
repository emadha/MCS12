import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faLeaf, faRemove, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { Transition } from '@headlessui/react'

export default function Alert ({
    className,
    contentClassName,
    children,
    type = 'default',
    processing,
    onDismiss = () => {
    },
    status,
    dismissible = false, asHtml = false,
}) {
    const [isShowing, setIsShowing] = useState(false)
    const [alertType, setAlertType] = useState(type)

    const [mainClassName, setMainClassName] = useState(
        'p-2 rounded border gap-2 items-stretch flex ' + (className ? ' ' + className : ''))

    const [alertIcon, setAlertIcon] = useState(faLeaf)
    const [alertIconClassName, setAlertIconClassName] = useState('text-neutral-300 dark:text-neutral-300/40')

    useState(e => {

        setTimeout(e => {
            setIsShowing(true)
        }, 10)

        if (status) {
            switch (status) {
                case -1:
                    type = ('danger')
                    break
                case 1:
                    type = ('success')
                    break
                default:
                    type = ('info')
                    break
            }
        }

        switch (type) {
            case 'danger': {
                setMainClassName(e => e + ' bg-red-800/80 text-white border-red-800 dark:bg-red-900/40 dark:border-red-800/60 ')
                setAlertIcon(faExclamationTriangle)
                break
            }
            case 'warning': {
                setMainClassName(e => e + ' bg-orange-400 text-white border-orange-400 dark:bg-orange-600 dark:border-orange-400/60 ')
                setAlertIcon(faExclamationTriangle)
                setAlertIconClassName('text-white')
                break
            }
            case 'info': {
                setMainClassName(e => e + ' bg-blue-600/80 text-white border-blue-400/40 dark:border-blue-400/70 ')
                setAlertIcon(faLeaf)
                break
            }
            case 'success': {
                setMainClassName(e => e + ' dark:bg-lime-700 bg-lime-600 text-white border-lime-400 dark:border-lime-300/30 ')
                setAlertIcon(faCheckCircle)
                break
            }
            default: {
                setMainClassName(e => e + ' bg-neutral-300/10 dark:bg-neutral-800 dark:border-neutral-700')
                setAlertIcon(faLeaf)
            }
        }

    }, [type])

    const dismiss = () => {
        dismissible && setIsShowing(false)
        onDismiss()
    }
    return children ?
        <div className={className}>
            <Transition show={isShowing}
                        enter={'animate-pop-in-lg duration-300'}
                        enterFrom={''}
                        leave={'animate-pop-out-lg duration-300'}
                        leaveFrom={''}
                        leaveTo={''}>
                <div className={'relative ' + mainClassName}>
                    <div className={'flex items-center justify-center w-12 relative'}>
                        <FontAwesomeIcon
                            className={'p-1.5 w-full animate-ping -left-1.5 text-3xl opacity-20 absolute aspect-square ' + alertIconClassName}
                            icon={processing ? faSpinner : alertIcon} spin={processing}/>
                        <FontAwesomeIcon
                            className={'p-1.5 w-full absolute -left-1.5 dark:text-white aspect-square ' + alertIconClassName}
                            icon={processing ? faSpinner : alertIcon} spin={processing}/>
                    </div>

                    <div className={'relative ' + (contentClassName ? ' ' + contentClassName : '') +
                        (dismissible ? ' pr-14 rtl:pl-14 rtl:pr-0 ' : ' ')}>
                        {asHtml ? <div className={'w-full text-start'} dangerouslySetInnerHTML={{ __html: children.join("\n") }}/>
                            : <div className={'w-full text-start'}>{children}</div>}
                    </div>

                    {dismissible ? <div className={'w-1/12 hover:cursor-pointer dark:text-white z-10 absolute top-[29%] right-5 rtl:left-0 rtl:right-auto'}>
                        <FontAwesomeIcon onClick={dismiss}
                                         className={'p-1 ring ring-white/20 dark:ring-red-700/20 rounded-full h-5 aspect-square block hover:!text-white hover:animate-pulse hover:font-bold duration-500 hover:cursor-pointer ' +
                                             (alertIconClassName ? ' ' + alertIconClassName : '')} icon={faRemove}/>
                    </div> : <></>}
                </div>
            </Transition></div> : <></>
}
