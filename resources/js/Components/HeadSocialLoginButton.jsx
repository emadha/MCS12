import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function HeadSocialLoginButton ({ className, icon, link }) {
  return <a href={link} className={'flex items-center justify-center aspect-square w-1/3 text-center ' +
    'text-neutral-500 hover:text-black ' +
    'dark:hover:text-neutral-200 dark:hover:bg-neutral-800 rounded'}>
    <FontAwesomeIcon icon={icon}
                     className={'mr-2 transition-all text-6xl aspect-square'}/>
  </a>
}
