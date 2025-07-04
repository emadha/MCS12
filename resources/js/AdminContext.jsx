import { createContext } from 'react'

let pageLang = []

export let AdminContext = createContext({
    darkMode: null,
    toggleDarkMode: () => {},
    pageLang: [],
    setPageLang: (_) => pageLang = _,
    lang: (...key) => key.map(_key => pageLang[_key] ?? _key).join(' '),
    formatNumbers: (number) => {
        return number.toLocaleString()
    },
})
