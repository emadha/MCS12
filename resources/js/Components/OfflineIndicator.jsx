import React, { useState, useEffect } from 'react';

export default function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        // Function to update the online status
        const handleStatusChange = () => {
            setIsOffline(!navigator.onLine);
        };

        // Add event listeners
        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        // Clean up
        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="p-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-lg shadow-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>You are currently offline</span>
            </div>
        </div>
    );
}
