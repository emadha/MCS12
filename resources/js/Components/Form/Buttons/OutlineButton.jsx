import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function OutlineButton ({
  className,
  children,
  icon,
  active,
  disabled,
  onClick,
  hideTextOnSmallScreen = true,
  type = 'button',
}) {
  return <button
    className={'btn btn-outline py-2 px-4 rounded dark:hover:bg-neutral-800 ring-1 whitespace-nowrap ring-indigo-700/20'
      + ' hover:ring-indigo-500 flex gap-x-1'
      + ' focus:ring-2 focus:ring-indigo-00'
      + ' disabled:animate-none disabled:opacity-20 disabled:bg-neutral-200 dark:disabled:bg-neutral-700'
      + ' disabled:cursor-default'
      + (active ? ' ring-indigo-600' : ' ')
      + (className ? ' ' + className : '')}
    disabled={disabled}
    onClick={onClick}

    type={type}
  >

    {icon ? <span><FontAwesomeIcon icon={icon}
                                className={' align-middle '
                                  + (hideTextOnSmallScreen ? '' : '')}/></span>
      : <></>
    }

    <span className={' '
      + (hideTextOnSmallScreen ? ' hidden sm:inline-block' : '')}>
      {children}
    </span>

  </button>
}
