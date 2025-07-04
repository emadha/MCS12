import React, { useEffect, useState } from 'react'
import { Head, usePage } from '@inertiajs/react'
import { AdminContext } from '@/AdminContext'
import Navbar from '@/Admin/Components/Navbar'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { isArray } from 'lodash'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminWrapper ({ children }) {

    const {
        GOOGLE_LOGIN_REDIRECT_URL, MICROSOFT_LOGIN_REDIRECT_URL, settings, auth,
        title, description,
        flash,
    } = usePage().props

    let [pageLang, setPageLang] = useState(usePage().props.lang)

    const [darkMode, setDarkMode] = useState((localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)))
    const [userPrefs, setUserPrefs] = useState({})
    const [titleOptions, setTitleOptions] = useState([])

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

    let lang = (...key) => key.map(_key => pageLang[_key] ?? _key).join(' ')

    const toggleDarkMode = () => {
        setDarkMode(prev => !darkMode)
        setPrefs('theme', darkMode ? 'light' : 'dark')
    }

    const setPrefs = (key, value) => {
        setUserPrefs({ ...userPrefs, ...{ key: value } })
        localStorage[key] = value
    }

    const getPrefs = (pref) => {
        return localStorage[pref] || null
    }

    const fn = {
        darkMode: darkMode,
        setDarkMode: setDarkMode,
        toggleDarkMode: toggleDarkMode,
        lang: lang,
        titleOptions: titleOptions,
        setTitleOptions: setTitleOptions,
    }
    return auth?.user ? <div className={'dark:text-white dark:bg-neutral-900 bg-slate-100'}>
        <Head><title>{title}</title></Head>
        <AdminContext.Provider value={{ ...fn }}>
            <Navbar/>
            <div className={'pt-20 container min-h-screen flex flex-wrap content-between'}>
                <div className={'bg-transparent min-h-[500px] w-full'}>
                    <div className={'mb-12 flex sticky top-16 z-10 dark:bg-neutral-900 px-2 -mx-2 py-3 justify-between items-center'}>
                        <h1 className={'text-5xl rounded-xl m-0 p-0'}>
                            {title}
                        </h1>
                        <div className={'flex'}>{titleOptions.map(titleOption =>
                            <SecondaryButton size={'xs'}
                                             icon={titleOption.icon}
                                             onClick={titleOption.onClick}>
                                {titleOption.title}
                            </SecondaryButton>,
                        )}
                        </div>
                    </div>
                    {children}
                </div>
                <div className={'py-5 mt-10 w-full'}>
                    <div className={'container px-10 flex text-center text-neutral-400 select-none'}>
                        <div className={'w-full text-xs'}>&copy; Mecarshop.com</div>
                    </div>
                </div>
            </div>
            <Toaster toastOptions={{
                duration: 5000, position: 'bottom-center', style: {
                    borderRadius: '10px', background: '#333', color: '#fff', marginBottom: '10px',
                },
            }}/>
        </AdminContext.Provider>
    </div> : <div className={'w-screen h-screen bg-neutral-900 flex items-center justify-center'}>
        <Head title={title}/>
        <small className={'text-white'}>Unauthorized</small>
    </div>
}
