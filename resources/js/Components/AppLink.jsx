import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from '@inertiajs/react'

export default function AppLink({ className, children, href, as = 'a', icon, dangerouslySetInnerHTML, ...props }) {
    return dangerouslySetInnerHTML ?
        <Link as={as} dangerouslySetInnerHTML={dangerouslySetInnerHTML} {...props}/>
        : <Link className={'' + (className ? ' ' + className : '')}
                href={href}
                as={as}>
            {icon ? <FontAwesomeIcon icon={icon} className={'rtl:ml-1.5 rtl:mr-0 mr-1'}/> : <></>}
            {children}
        </Link>
}
