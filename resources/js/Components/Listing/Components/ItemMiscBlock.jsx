import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ItemMiscBlock ({ className, children, icon, title, showTitle = true }) {
  return <div
    className={'gap-x-2 w-full sm:w-1/2 break-words px-0 justify-start items-center py-0.5' + (className ? ' ' + className : '')}>
    <div>

      {title && showTitle && <span className={'dark:text-neutral-400 sm:w-auto w-16'}>{title}</span>}
    </div>
    <strong className={'font-extrabold text-black dark:text-white msl-6'}>{children}</strong>
  </div>
}