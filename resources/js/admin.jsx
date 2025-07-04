import './bootstrap'
import '../css/app.css'

import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import AdminWrapper from '@/Layouts/AdminWrapper'

// const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel'
axios.defaults.withCredentials = true

createInertiaApp({
    title: (title) => `${title}`, resolve: (name, t) => {
        const pages = import.meta.glob('./Admin/Pages/**/*.jsx', { eager: true })
        let page = pages[`./Admin/Pages/${name}.jsx`]
        console.log(pages, name,page)
        page.default.layout = page?.default?.layout || (page => {
            return <AdminWrapper children={page}/>
        })

        return page
    }, setup ({ el, App, props }) {
        const root = createRoot(el)
        root.render(<App {...props} />)
    }, progress: {
        color: '#03b283', showSpinner: true,
    },
})
