import {Head, useForm, usePage} from '@inertiajs/react'
import NavBar from '@/Layouts/Elements/Navbar/NavBar'
import Footer from '@/Layouts/Elements/Footer'
import {useEffect, useState} from 'react'
import {AppContext} from '@/AppContext'
import NotAuthorized from '@/Components/Modals/NotAuthorized'
import defaultTheme from 'tailwindcss/defaultTheme'
import InstallPWAButton from '@/Components/InstallPWAButton';
import {motion} from 'framer-motion'
import MessageDialog from '@/Components/Modals/MessageDialog'
import {Inertia} from '@inertiajs/inertia'

import toast, {Toaster} from 'react-hot-toast'
import {isArray} from 'lodash'

export default function Wrapper({children}) {

    const {post, data, setData} = useForm()
    const {
        GOOGLE_LOGIN_REDIRECT_URL, MICROSOFT_LOGIN_REDIRECT_URL, settings, auth,
        title, description,
        flash,
    } = usePage().props

    let [pageLocale, setPageLocale] = useState(usePage().props.locale)
    let [pageLang, setPageLang] = useState(usePage().props.lang)
    let [pageRTL, setPageRTL] = useState(usePage().props.rtl ?? false)

    const url = usePage().url

    const [wrapperLoading, setWrapperLoading] = useState(true)
    const [darkMode, setDarkMode] = useState((localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)))
    const [automaticSize, setAutomaticSize] = useState(true)
    const [hasSidebar, setHasSidebar] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= parseInt(defaultTheme.screens.lg))
    const [navbarTransparent, setNavbarTransparent] = useState(false)
    const [userPrefs, setUserPrefs] = useState({})
    const [notAuthorizedModal, setNotAuthorizedModal] = useState(false)
    const [modalShow, setModalShow] = useState(false)
    const [modalData, setModalData] = useState({title: null, content: null})
    const [mainWindowScroll, setMainWindowScroll] = useState(false)

    const api = axios.create({
        url: '/api',
        withCredentials: true,
        withXSRFToken: true,
    })
    api.interceptors.request.use(async config => {
        await axios.get('/sanctum/csrf-cookie')
        return config
    })
    api.interceptors.response.use((response) => {
        return response
    }, (error) => {

        if (error.response.status === 401) {
            setModalShow(true)
            setModalData({
                title: lang('NOT_AUTHORIZED_TITLE'), content: <NotAuthorized/>,
            })
        }

        return Promise.reject(error)
    })
    const protectedApi = axios.create({
        url: '/api',
        withCredentials: true,
        withXSRFToken: true,
    })
    protectedApi.interceptors.request.use(async config => {
        await axios.get('/sanctum/csrf-cookie')
        return config
    })
    protectedApi.interceptors.response.use((response) => {
        return response
    }, (error) => {
        if (error.response.status === 401) {
            setModalShow(true)
            setModalData({
                title: lang('NOT_AUTHORIZED_TITLE'), content: <NotAuthorized/>,
            })
        }
        return Promise.reject(error)
    })

    // const pusher = new Pusher('5725b7dd3f7f1725aab9', {
    //   cluster: 'eu',
    // })
    //
    // var channel = pusher.subscribe('sole-winter-925')
    // channel.bind('my-event', function (data) {
    //   alert(JSON.stringify(data))
    // })

    useEffect(e => {
        window.onload = function () {
            if (typeof google !== 'undefined' && google.accounts) {
                google.accounts?.id.initialize({
                    client_id: '37857179356-d54cn17pnqb0qcnocggdjnhkubduuqpq.apps.googleusercontent.com',
                    login_uri: GOOGLE_LOGIN_REDIRECT_URL,
                    callback: () => {
                        window.location = route('login.google')
                    },
                })
                if (auth?.user) {
                    google?.accounts?.id?.cancel()
                } else {
                    google?.accounts?.id?.prompt()

                }
            }
        }

        const wrapperLoadingTimer = setTimeout(() => setWrapperLoading(false), 10)

        return () => {
            clearTimeout(wrapperLoadingTimer)
        }

    }, [])

    const setPrefs = (key, value) => {
        setUserPrefs({...userPrefs, ...{key: value}})
        localStorage[key] = value
    }

    const getPrefs = (pref) => {
        return localStorage[pref] || null
    }

    useEffect(e => {

        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    useEffect(() => {
        flash && Object.values(flash)?.filter(f => f).length && Object.values(flash)?.map(f => {
            if (isArray(f)) {
                f.map(_f => (_f.message && _f.status === 1) ? toast.success(_f.message) : toast.error(_f?.message || '.'))
            } else {
                f.status === 1 ? toast.success(f.message) : toast.error(f?.message)
            }
        })
    }, [flash])

    useEffect(() => {

        Inertia.on('before', () => {
            setModalShow(false)
        })

        Inertia.on('success', (event) => {
        })

        Inertia.on('finish', (f) => {
            // setWrapperLoading(false)

        })
        Inertia.on('invalid', (e) => {
            if (e.detail.response.status === 429) {
                let retryAfter = parseInt(e.detail.response?.headers['retry-after'] ?? 0) ?? 0

                setModalData({
                    content: <div
                        className={'p-10 flex flex-wrap justify-center sm:justify-between gap-y-5 items-center'}>
                        <h4 className={'my-0 px-5'}>{lang('Please wait')}</h4>
                        {retryAfter > 0 ?
                            <span className={'text-sm py-1 px-2 rounded animate-pulse dark:bg-neutral-800'}>
                                {lang('Retry after')} <CountDownWidget
                                initTime={e.detail.response.headers['retry-after']}/></span> : <></>}
                    </div>,

                })
                setModalShow(true)
                return false
            }

        })

        Inertia.on('error', (err, st) => {
            return err
        })

    }, [])

    const CountDownWidget = ({initTime}) => {

        const [time, setTime] = useState(initTime)
        let interval = setInterval(() => {
        }, 0)

        /**
         * Translates seconds into human-readable format of seconds, minutes, hours, days, and years
         *
         * @param  {number} seconds The number of seconds to be processed
         * @return {string}         The phrase describing the amount of time
         */
        function forHumans(seconds) {
            var levels = [
                [Math.floor(seconds / 31536000), 'years'],
                [Math.floor((seconds % 31536000) / 86400), 'days'],
                [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
                [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
                [(((seconds % 31536000) % 86400) % 3600) % 60, lang('seconds')],
            ]
            var returntext = ''

            for (var i = 0, max = levels.length; i < max; i++) {
                if (levels[i][0] === 0) {
                    continue
                }
                returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1])
            }

            return returntext.trim()
        }

        useEffect(() => {
            interval = setInterval(() => {
                // fixme time won't stop running
                if (time == 0 && interval) {
                    clearInterval(interval)
                }
                setTime(prevState => parseInt(prevState - 1))
            }, 1000)

            return () => clearInterval(interval)
        }, [])

        return <>{time > 0 ? forHumans(time) : lang('You can retry now.')}</>
    }
    const toggleDarkMode = () => {
        setDarkMode(prev => !darkMode)
        setPrefs('theme', darkMode ? 'light' : 'dark')
    }

    const logout = () => {
        post(route('logout'))
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(e => !isSidebarOpen)
    }

    let lang = (...key) => key.map(_key => pageLang[_key] ?? _key).join(' ')

    const setLocaleCookie = async (locale) => {
        setWrapperLoading(true)
        await api.post(route('locale.change'), {
            locale: locale,
        }).then(res => {
            setPageLang(res.data.lang)
            setPageLocale(res.data.locale)
            setPageRTL(res.data.rtl)
        }).finally(() => {
            setWrapperLoading(false)
        })
    }

    const getLocaleCookie = () => document.cookie.split('; ').find((row) => row.startsWith('locale='))?.split('=')[1]

    const getCarYears = () => axios.post(route('api.cars.years'))
    const getCarMakes = (yearFrom, yearTo) => axios.post(route('api.cars.makes'), {yearFrom, yearTo})

    const getCarMakesModels = (make, yearFrom, yearTo) => axios.post(route('api.cars.makes.models', {
        makes: make, yearFrom, yearTo,
    }))

    const getCarMakesModelsSeries = (make, model) => axios.post(route('api.cars.makes.models.series', {
        makes: make,
        models: model
    }))
    const getCarMakesModelsSeriesTrims = (make, model, series) => axios.post(route('api.cars.makes.models.series.trims', {
        makes: make,
        models: model,
        series: series
    }))

    const fn = ({
        notAuthorizedModal: notAuthorizedModal,
        wrapperLoading: wrapperLoading,
        setWrapperLoading: setWrapperLoading,
        api: api,
        protectedApi: protectedApi,
        toggleDarkMode: toggleDarkMode,
        darkMode: darkMode,
        toggleSidebar: toggleSidebar,
        automaticSize: automaticSize,
        setAutomaticSize: setAutomaticSize,

        isSidebarOpen: isSidebarOpen,
        setIsSidebarOpen: setIsSidebarOpen,

        userPrefs: userPrefs,
        setUserPrefs: setUserPrefs,

        mainWindowScroll: mainWindowScroll,
        setMainWindowScroll: setMainWindowScroll,
        setPrefs: setPrefs,
        getPrefs: getPrefs,
        wData: data,
        wSetData: setData,
        wLogout: logout,
        setModalShow: setModalShow,

        modalShow: modalShow,
        setModalData: setModalData,

        hasSidebar: hasSidebar,

        setHasSidebar: setHasSidebar,
        lang: lang,
        pageLang: pageLang,
        setPageLang: setPageLang,
        rtl: pageRTL,
        setPageRTL: setPageRTL,
        setLocaleCookie: setLocaleCookie,
        getLocaleCookie: getLocaleCookie,

        settings: settings,
        getCarMakes: getCarMakes,
        getCarMakesModels: getCarMakesModels,
        navbarTransparent: navbarTransparent,
        setNavbarTransparent: setNavbarTransparent,
        getCarMakesModelsSeries: getCarMakesModelsSeries,
        getCarMakesModelsSeriesTrims: getCarMakesModelsSeriesTrims,
        pageLocale: pageLocale,
        setPageLocale: setPageLocale,

        formatNumbers: (number) => {
            return number.toLocaleString()
        },

    })

    useEffect(() => {
        document.documentElement.style = mainWindowScroll ? 'scrollbar-width:thin' : 'scrollbar-width:none'
    }, [mainWindowScroll])

    useEffect(e => {
        if (automaticSize) {
            window.addEventListener('resize', onResize)
        } else {
            window.removeEventListener('resize', onResize)
        }
        return () => window.removeEventListener('resize', onResize)
    }, [automaticSize])

    useEffect(() => {
        document.documentElement.dir = pageRTL ? 'rtl' : 'ltr'
    }, [pageLang, pageRTL])

    const onResize = () => {
        if (window.innerWidth < parseInt(defaultTheme.screens.lg)) {
            setIsSidebarOpen(false)
        } else {
            isSidebarOpen && setIsSidebarOpen(true)
        }
    }

    return <div
        className={'scroll-smooth duration-300 transition-all min-h-screen ' +
            (isSidebarOpen ? 'sm:max-h-max max-h-screen sm:overflow-visible overflow-hidden' : '')}>

        <Head>
            <title>{title.toString()}</title>
            <meta name={'description'} content={description.toString()}/>
        </Head>

        <AppContext.Provider value={{...fn}}>
            <div className={'relative z-10'}>
                <NavBar auth={auth} className={'' + (url === '/' ? '' : '')}/>
                <div className={'mx-auto flex flex-wrap transition-all'}>
                    <div className={'mx-auto w-full'}>

                        <div className={'min-h-[calc(100vh_-_240px)] mb-96 z-10 bg-background relative'}>
                            {children}
                        </div>

                        <motion.div
                            className={'fixed bottom-0 w-screen z-0 bg-background text-white'}
                            initial={{opacity: 0, y: 100}}
                            whileInView={
                                {opacity: [0, 1], y: [100, 0]}
                            }>
                            <Footer/>
                        </motion.div>
                    </div>
                </div>
                <InstallPWAButton/>
                <MessageDialog show={modalShow} data={modalData}/>
            </div>
        </AppContext.Provider>
        <Toaster toastOptions={{
            duration: 5000, position: 'bottom-center', style: {
                borderRadius: '10px', background: '#333', color: '#fff', marginBottom: '10px',
            },
        }}/>

    </div>
}
