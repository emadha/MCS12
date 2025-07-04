import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ListingsTopBar ({ className, text, icon, active, onClick = () => {} }) {
  return <button className={'rounded flex items-center px-3 py-2 hover:bg-neutral-200 hover:text-black ' +
    (text?.length ? 'gap-x-2' : '') +
    (active ? ' font-bold !bg-black !text-white ' : '') +
    (className ? ' ' + className : '')
  }
                 onClick={onClick}>
    <FontAwesomeIcon icon={icon}/>
    <small>{text}</small>
  </button>
}
