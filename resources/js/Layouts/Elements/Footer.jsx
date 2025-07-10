import {useContext} from 'react'
import {AppContext} from '@/AppContext'
import DarkModeSwitcher from '@/Components/DarkModeSwitcher'
import {usePage} from '@inertiajs/react'
import {
    faCheck,
    faCookie,
    faDatabase,
    faFileContract,
    faHeart,
    faLock,
    faNoteSticky,
    faStar,
    faUserShield
} from '@fortawesome/free-solid-svg-icons'
import AppLink from '@/Components/AppLink'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Hr from '@/Components/Hr'

export default function Footer({className, children}) {
    const {lang, setLocaleCookie, pageLocale, darkMode, toggleDarkMode} = useContext(AppContext)
    const {settings} = usePage().props

    return <>
        <div className={'container text-sm py-10 gap-y-5 flex flex-wrap items-start justify-center text-white'}>
            <div className={'px-5 md:w-4/6 text-xs'}>
                <div
                    className={'text-center md:text-left items-center justify-center md:justify-start rtl:justify-center rtl:md:justify-start gap-y-2.5 ' +
                        ' flex flex-wrap pb-2 rounded'}>
                    {settings?.locales ? <div className={'flex flex-wrap gap-x-5 items-center'}>
                        {Object.entries(settings?.locales?.list).map(language =>
                            <div className={'cursor-pointer select-none xs:w-auto my-1 xs:my-0'
                                + (pageLocale === language[0]
                                    ? ' text-indigo-400 bg-blue-900/10 border border-blue-900/50 text-xs rounded px-2 items-center flex justify-center md:justify-start gap-x-1.5 py-1 '
                                    : '') +
                                (className ? ' ' + className : '')}
                                 onClick={e => setLocaleCookie(language[0])}
                                 key={language[0]}>
                                <FontAwesomeIcon icon={faCheck}
                                                 className={'text-xs' +
                                                     (pageLocale === language[0] ? ' opacity-100 ' : ' hidden')}/>
                                <span>{language[1]}</span>
                            </div>,
                        )}
                    </div> : <></>}

                    <div
                        className={'flex w-full gap-x-4 gap-y-2 md:mt-0 mt-10 flex-wrap items-center justify-center sm:justify-start'}>
                        {settings?.regions?.list &&
                            Object.entries(settings?.regions.list)?.map((region, k) =>
                                <a href={route(`index.${region[0]}`)}
                                   key={region[1]}
                                   className={'gap-x-2 py-0.5 flex justify-start cursor-pointer hover:grayscale-0 hover:opacity-100 transition-all rounded items-center text-xs ' +
                                       (settings.regions.current == region[0] ? 'dark:bg-neutral-800 ' : ' grayscale opacity-30 ')}>

                                    <img src={`/res/icons/${region[0]}.png`} className={'w-4 mx-auto h-auto'}/>
                                    <span>{lang(region[1])}</span>
                                </a>)
                        }
                    </div>

                </div>

                <div className={'text-neutral-500 flex flex-wrap justify-center md:justify-start gap-y-3'}>
                    <div className={'flex w-full gap-x-5 gap-y-2 flex-wrap md:justify-start justify-center'}>
                        <AppLink href={route('pages.privacy')} icon={faLock}>{lang('Privacy Policy')}</AppLink>
                        <AppLink href={route('pages.terms')}
                                 icon={faFileContract}>{lang('Terms and Conditions')}</AppLink>
                        <AppLink href={route('pages.cookies')} icon={faCookie}>{lang('Cookies')}</AppLink>
                        <AppLink href={route('pages.updates')} icon={faNoteSticky}>{lang('Updates')}</AppLink>
                        <AppLink href={route('pages.thankyou')} icon={faStar}>{lang('Thank You')}</AppLink>
                        <AppLink href={route('pages.support')} icon={faUserShield}>{lang('Support')}</AppLink>
                    </div>
                    <AppLink href={route('database.cars.index')} icon={faDatabase}>{lang('Cars Database')}</AppLink>
                </div>
            </div>

            <div className={'w-full md:w-2/6 px-7'}>
                <div
                    className={'text-left flex flex-wrap justify-center md:justify-end md:rtl:justify-end rtl:justify-center items-center content-end text-xs ' +
                        ' px-2 rounded'}>
                    <DarkModeSwitcher darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
                    <span
                        className={'w-full text-center md:text-right md:rtl:text-left whitespace-nowrap'}>&copy; Mecarshop.com
                        2013 - {new Date().getFullYear()}</span> <span>{lang(
                    'Made in Lebanon, with')}
                    <FontAwesomeIcon className={'text-red-500 text-xs animate-pulse ml-1 rtl:mr-1 rtl:ml-0'}
                                     icon={faHeart}/></span>
                </div>
            </div>
        </div>
    </>
}
