import '../css/app.css';
import './bootstrap';

import {createInertiaApp} from '@inertiajs/react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import Wrapper from "@/Layouts/Wrapper.jsx";
import AdminWrapper from "@/Layouts/AdminWrapper.jsx";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: name => {
        const pages = import.meta.glob('./Admin/Pages/**/*.jsx', {eager: true})
        let page = pages[`./Admin/Pages/${name}.jsx`]
        page.default.layout = page.default.layout || (page => <AdminWrapper children={page}/>)
        return page
    },
    setup({el, App, props}) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
