import { Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default function UserLink ({ user, className }) {
  return <Link className={'font-bold flex rtl:flex-row-reverse items-center gap-x-2'}
               // href={user.link}
               as={'div'}
               dir={'ltr'}>
    <FontAwesomeIcon icon={faUser}/>
    <span>{user.name}</span>
  </Link>
}