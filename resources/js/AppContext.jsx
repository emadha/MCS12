import {createContext} from 'react'

let pageLang = []

export let AppContext = createContext({
    getPrefs: () => {
    },
    api: {},
    protectedApi: {},
    pageLang: [],
    setPageLang: (_) => pageLang = _,
    lang: (...key) => key.map(_key => pageLang[_key] ?? _key).join(' '),
    darkMode: true,
    toggleDarkMode: () => {
    },
    formatNumbers: (number) => {
        return number.toLocaleString()
    },
})
