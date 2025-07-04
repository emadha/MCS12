import { Link } from '@inertiajs/react'

export default function ListingBlockBase ({
    title,
    className,
    bodyClassName,
    title_link,
    children,
    options = { showTitle: true },
}) {
    return <div className={'dark:transparent dark:text-neutral-500 w-full py-10 '
        + (className ? ' ' + className : '')}>
        {options.showTitle && <h3 className={'dark:pb-5 select-none pb-3 px-2 text-left rtl:text-right duration-1000'}>
            {title_link ?
                <Link href={title_link}>{title}</Link>
                : <span>{title}</span>
            }
        </h3>}
        <div className={bodyClassName}>
            {children}
        </div>
    </div>
}
