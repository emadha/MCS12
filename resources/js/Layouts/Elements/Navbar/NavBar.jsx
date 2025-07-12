import {faCar, faHome, faShop} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link, usePage} from '@inertiajs/react';
import AppLink from '@/Components/AppLink';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '@/AppContext';
import {faUser} from '@fortawesome/free-regular-svg-icons';
import SearchArea from '@/Layouts/Elements/Navbar/Elements/SearchArea';
import UserDropdownMenu from '@/Components/UserDropdownMenu';

export default function NavBar({className}) {
    const [searchFocused, setSearchFocused] = useState(0);

    const {
        setLocaleCookie,
        isSidebarOpen,
        setIsSidebarOpen,
        hasSidebar,
        setHasSidebar,
        automaticSize,
        setAutomaticSize,
        toggleDarkMode,
        lang,
        settings,
    } = useContext(AppContext);

    const {
        auth, domain, domain_long, app_title,
    } = usePage().props;

    const [brandClassName, setBrandClassName] = useState(
        'text-md md:text-lg lg:text-xl ');
    const [navbarYPadding, setNavbarYPadding] = useState('py-5 ');

    const _scroll = () => {
        if (document.scrollingElement.scrollTop < 10) {
            setNavbarYPadding('py-5');
            setBrandClassName(e => '');
        } else /* if (document.scrollingElement.scrollTop > 100) */ {
            setNavbarYPadding('py-3 backdrop-blur-sm');
            setBrandClassName(e => '');
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', _scroll);
        return () => window.removeEventListener('scroll', _scroll);
    });
    return <div
        className={'fixed top-0 z-[1000] left-0 w-full duration-500 ' +
            navbarYPadding + (className ? ' ' + className : '')}>
        <nav className="container px-5">
            <div className="flex items-stretch justify-between">
                {/* Nav Brand Area */}
                <div
                    className={'flex flex-wrap items-center justify-start duration-300' +
                        (searchFocused
                            ? ' w-0 overflow-hidden lg:w-2/6 opacity-30 lg:opacity-50 '
                            : ' sm:w-2/6 w-1/6 ')}>

                    <div
                        className={'whitespace-nowrap group flex items-center justify-start gap-x-2'}>
                        <AppLink href={'/'}
                                 className={'flex items-center justify-center cursor-pointer transition-all rounded w-12 aspect-square text-center ' +
                                     'dark:bg-neutral-800 '}>
                            <div
                                className={'font-black text-xl select-none transition-colors overflow-hidden aspect-square mt-1'}>
                                <div
                                    className={'transition-all text-neutral-900 dark:text-neutral-400 group-hover:text-white group-hover:-mt-10'}>
                                    <div className={'w-9 mt-0.5'}>
                                        <img
                                            src={`/res/icons/${settings.regions.current}.png`}
                                            alt={settings.regions.current}
                                            className={'w-full rounded -mt-0.5'}/>
                                    </div>
                                    <FontAwesomeIcon icon={faHome}
                                                     className={'dark:text-white text-black text-3xl mt-1'}/>
                                </div>
                            </div>
                        </AppLink>

                        <Link
                            className={'font-display hidden sm:inline-block font-black select-none whitespace-nowrap transition-all text-5xl ' +
                                brandClassName}
                            href={'/'}>

                            <span>{app_title}</span>

                            <small
                                className={'whitespace-nowrap w-full text-xs font-light hidden md:block -mt-1.5'}>
                                {lang('the online car marketplace')}
                            </small>
                        </Link>
                    </div>
                </div>

                {false && <SearchArea searchFocused={searchFocused}
                                      placeholder={'AI Assistance ready!'}
                                      setSearchFocused={setSearchFocused}/>}
                <div
                    className={'flex items-center justify-between text-xs duration-300 hover:opacity-100 ' +
                        (searchFocused
                            ? ' lg:w-4/6 opacity-30 lg:opacity-50 '
                            : ' w-5/6 sm:w-4/6 ')}>
                    <div
                        className={'select-none flex w-full flex-wrap items-center justify-end gap-x-5'}>

                        <AppLink href={route('shops.index')}
                                 icon={faShop}>
                            {lang('Shops')}
                        </AppLink>

                        <AppLink href={route('listing.car.submit')}
                                 icon={faCar}>
                            {lang('List your Car')}
                        </AppLink>

                        <div>
                            {auth?.user
                                ? <div
                                    className={'flex items-center whitespace-nowrap justify-center'}>
                                    <UserDropdownMenu user={auth.user}/>
                                </div>
                                : <AppLink href={route('login')}
                                           className={'py-2 px-5 hover:bg-lime-700 transition-all rounded hover:text-white ' +
                                               'font-black'}>
                                    <FontAwesomeIcon icon={faUser}
                                                     className={'mr-2 rtl:mr-0 rtl:ml-2'}/>
                                    {lang('Login')}
                                </AppLink>}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>;

}
