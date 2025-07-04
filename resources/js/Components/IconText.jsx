import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function IconText ({ className, icon, iconClassName, text }) {
  return <span className={'inline-block' + (className ? ' ' + className : '')}>
    <FontAwesomeIcon icon={icon} className={'' + (iconClassName ? ' ' + iconClassName : '')}/>
    <span className={'ml-1'}>{text}</span>
  </span>
}