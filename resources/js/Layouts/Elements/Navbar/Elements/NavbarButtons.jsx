import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavbarButtons ({ className, children, icon, onClick, disabled = false }) {
  return <div
    className={'select-none whitespace-nowrap p-2 px-5 group flex items-center justify-center '
      + (disabled
        ? ''
        : 'dark:hover:bg-neutral-800 dark:hover:text-white dark:bg-transparent hover:bg-neutral-50 rounded transition-all cursor-pointer ')
      + (children?.length ? ' gap-x-2 ' : '')
      + (className ? ' ' + className : '')}
    dir={'ltr'}
    onClick={onClick}
  >
    {icon && <FontAwesomeIcon className={'align-middle'} icon={icon}/>}
    <span>{children}</span>

  </div>
}