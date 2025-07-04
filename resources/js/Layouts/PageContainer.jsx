import { useContext } from 'react'
import { AppContext } from '@/AppContext'
import { Link, usePage } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export default function PageContainer ({
    className,
    mainClassName,
    headerClassName = 'text-center',
    bodyClass,
    title,
    subtitle,
    children,
}) {
    const { lang } = useContext(AppContext)
    const props = usePage().props

    return <div
        className={'shadow-sm mt-32 mx-auto border dark:border-neutral-800 max-w-6xl duration-1000 px-5 xl:px-20 md:px-10 pt-10 pb-20 dark:text-neutral-300 dark:bg-neutral-900/60 bg-white/80 rounded-md '
            + (className ? ' ' + className : '')}>
        <div className={'select-none text-center mt-10 mb-16 flex justify-center'}>
            <div className={''}>
                {props.links?.back
                    ? <Link href={props.links.back} className={'flex items-center gap-x-1 w-12'}>
                        <FontAwesomeIcon icon={faChevronLeft} className={'text-xs'}/>
                        <span className={'font-black text-lg'}>Back</span>
                    </Link>
                    : <></>
                }
                <h1 className={' text-4xl ' + (headerClassName ? ' ' + headerClassName : '')}>
                    {lang(title)}</h1>
                <span>{subtitle}</span>
            </div>
        </div>
        <div className={(mainClassName ? mainClassName : '')}>
            <div className={'' + (bodyClass ? ' ' + bodyClass : '')}>{children}</div>
        </div>
    </div>
}
