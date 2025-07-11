import {useContext, useEffect} from 'react';
import {AppContext} from '@/AppContext';
import {Link, usePage} from '@inertiajs/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';

export default function PageContainer({
    className,
    mainClassName,
    headerClassName = 'text-center',
    bodyClass,
    title,
    subtitle,
    children,
}) {
    const {lang} = useContext(AppContext);
    const props = usePage().props;

    useEffect(() => {
        window.scrollTo({behavior: 'smooth', top: 0});
    }, []);
    return <div
        className={'container mx-auto px-5 py-10'
            + (className ? ' ' + className : '')}>
        <div
            className={'select-none text-center mt-10 mb-16 flex justify-center'}>
            <div className={''}>
                {props.links?.back
                    ? <Link href={props.links.back}
                            className={'flex items-center gap-x-1 w-12'}>
                        <FontAwesomeIcon icon={faChevronLeft}
                                         className={'text-xs'}/>
                        <span className={'font-black text-lg'}>Back</span>
                    </Link>
                    : <></>
                }
                <h1 className={' text-4xl ' +
                    (headerClassName ? ' ' + headerClassName : '')}>
                    {lang(title)}</h1>
                <span>{subtitle}</span>
            </div>
        </div>
        <div className={(mainClassName ? mainClassName : '')}>
            <div className={'' +
                (bodyClass ? ' ' + bodyClass : '')}>{children}</div>
        </div>
    </div>;
}
