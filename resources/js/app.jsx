import '../css/app.css';
import '../css/leaflet.css';
import 'leaflet/dist/leaflet.css';
import './bootstrap';

import {createInertiaApp} from '@inertiajs/react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import Wrapper from "@/Layouts/Wrapper.jsx";
import {registerPWA} from "@/pwa.jsx";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', {eager: true})
        let page = pages[`./Pages/${name}.jsx`]
        page.default.layout = page.default.layout || (page => <Wrapper children={page}/>)
        return page
    },
    setup({el, App, props}) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        // Register the PWA service worker
        registerPWA();
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
