import {useContext, useEffect} from 'react';
import {AppContext} from '@/AppContext';
import {Link, usePage} from '@inertiajs/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {clsx} from 'clsx';

export default function PageContainer({
    rootClassName,
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
    return <div className={clsx('bg-white dark:bg-background', rootClassName)}>
        <div className={clsx('container', className)}>
            <div>
                <div className={'max-w-4xl my-52 dark:drop-shadow-[0_0px_100px_#fff] drop-shadow-[0_0px_100px_#acf] mx-auto text-center'}>
                    {props.links?.back
                        ? <Link href={props.links.back}
                                className={'flex items-center gap-x-1 w-12'}>
                            <FontAwesomeIcon icon={faChevronLeft}
                                             className={'text-xs'}/>
                            <span className={'font-black text-lg'}>Back</span>
                        </Link>
                        : <></>
                    }
                    <h1>{lang(title).split(' ').map((word, i) => Math.random() > 0.7 ? <span key={i} className="refined-gradient">{word} </span> : word + ' ')}</h1>
                    <span>{subtitle}</span>
                </div>
            </div>
            <div className={(mainClassName ? mainClassName : '')}>
                <div className={'' +
                    (bodyClass ? ' ' + bodyClass : '')}>{children}</div>
            </div>
        </div>
    </div>;
}
