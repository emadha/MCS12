import React, { useState, useEffect } from 'react';
import { promptInstall, isPWA } from '../pwa';

export default function InstallPWAButton() {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed as PWA
        setIsInstalled(isPWA());

        // Setup the install prompt
        const showInstallPrompt = promptInstall(setIsInstallable);

        return () => {
            // Clean up
            setIsInstallable(false);
        };
    }, []);

    // Don't show the button if already installed or not installable
    if (isInstalled || !isInstallable) return null;

    return (
        <button
            onClick={promptInstall}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Install App
        </button>
    );
}
