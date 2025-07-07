// PWA registration and update handling

export const registerPWA = () => {
    // Check if the service worker is supported by the browser
    if ('serviceWorker' in navigator) {
        // Register the service worker
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('PWA Service Worker registered successfully:', registration.scope);

                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available, trigger user notification
                                triggerUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('PWA Service Worker registration failed:', error);
                });
        });
    }
};

// Function to notify users about available updates
const triggerUpdateNotification = () => {
    // We can use react-hot-toast for notifications
    if (window.toast) {
        window.toast.custom(
            (t) => (
                <div className="flex items-center justify-between p-4 bg-blue-100 dark:bg-blue-900 rounded shadow-lg">
                    <div className="flex items-center">
                        <div className="text-blue-800 dark:text-blue-200">
                            <span className="font-medium">Update Available!</span>
                            <p className="text-sm">New version of the app is available</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                window.location.reload();
                                window.toast.dismiss(t.id);
                            }}
                            className="ml-3 p-2 px-4 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => window.toast.dismiss(t.id)}
                            className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                        >
                            Later
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity }
        );
    }
};

// Function to check if the app is being used in standalone mode (installed PWA)
export const isPWA = () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
};

// Function to prompt user to install the PWA
export const promptInstall = (callback) => {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;

        // Notify the callback that the app is installable
        if (callback) callback(true);
    });

    // Return function that will show the install prompt
    return () => {
        if (deferredPrompt) {
            // Show the prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }

                // Clear the saved prompt since it can't be used again
                deferredPrompt = null;

                // Update the callback
                if (callback) callback(false);
            });
        }
    };
};
