import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {usePage} from '@inertiajs/react'
import {Children} from 'react'

export default function MainButton({
                                       className, iconClassName, children, type = 'button', processing,
                                       disabled, icon, iconPosition = 'start', onClick, dir,
                                       size = 'sm', title,
                                   }) {

    const rtl = usePage().props.rtl ?? false

    const _size = () => {
        switch (size) {
            case 'xs' :
                return ' px-4 py-2 text-xs font-semibold'
            case 'lg':
                return 'px-6 py-2 text-lg'
            case 'xl':
                return 'px-12 py-5 font-black text-2xl !rounded-2xl'

            default:
                return ' px-4 py-2 text-sm font-semibold'
        }
    }

    return <button
        className={
            'flex items-center rtl:font-sans font-mono whitespace-nowrap justify-start shadow hover:shadow-md' +
            ' text-left hover:shadow-none shadow-none ' +
            ' drop-shadow-none ' +
            'dark:hover:text-white ' +
            'disabled:opacity-20 ' +
            'transition ease-in-out duration-150 '
            + _size() + ' '
            + (Children.count(children) ? ' gap-x-2 ' : ' ') + ' '
            + (processing && ' opacity-25')
            + (className ? ' ' + className : ' ')}
        type={type}
        disabled={disabled || processing}
        onClick={onClick}
        icon={icon}
        title={title}
        dir={dir}>


        {iconPosition === 'start' ? processing
            ? <span className={'animate-pop-in'}><FontAwesomeIcon icon={faSpinner} className={iconClassName} spin={true}/></span>
            : icon && <FontAwesomeIcon className={'animate-pop-in' + (iconClassName ? ' ' + iconClassName : '')}
                                       icon={icon}/> : <></>}

        <div className={'w-full overflow-ellipsis overflow-hidden'}>{children}</div>

        {iconPosition === 'end' ? processing
            ? <span className={'animate-pop-in'}><FontAwesomeIcon icon={faSpinner} className={iconClassName} spin={true}/></span>
            : icon && <FontAwesomeIcon className={'animate-pop-in' + (iconClassName ? ' ' + iconClassName : '')}
                                       icon={icon}/> : <></>}
    </button>
}
