import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'

export default function DarkModeSwitcher ({ darkMode, toggleDarkMode = () => {} }) {

    const _iconsClass = 'cursor-pointer'
    const { lang } = useContext(AppContext)

    return <div className={'py-2 rounded cursor-pointer uppercase flex items-center gap-x-1 text-xl'}
                dir={'ltr'}
                onClick={toggleDarkMode}>
        <FontAwesomeIcon icon={!darkMode ? faToggleOn : faToggleOff} className={_iconsClass}/>
        <small className={'text-xs'}>{!darkMode ? lang('Lights On') : lang('Lights Off')}</small>
    </div>
}
