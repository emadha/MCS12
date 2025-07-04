import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';

export default function LanguageSelector() {
    // For demonstration - in a real app, this would come from context or props
    const currentLanguage = 'en';

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
    ];

    const setLanguage = (code) => {
        // This would need to be implemented to actually change the language
        console.log(`Language changed to ${code}`);
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-full
                               text-gray-500 focus:outline-none overflow-hidden"
                >
                    {/* Glassmorphism button background */}
                    <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-[4px] border border-white/20"></div>

                    {/* Button content */}
                    <span className="sr-only">Select language</span>
                    <GlobeAltIcon className="relative z-10 h-5 w-5" aria-hidden="true" />

                    {/* Hover glow effect */}
                    <motion.div
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 70%)'
                        }}
                    ></motion.div>
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-[14px] overflow-hidden focus:outline-none">
                    {/* Glassmorphism dropdown background */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[8px] border border-white/20 shadow-lg"></div>

                    <div className="relative z-10 py-1">
                        {/* Language Selection Header */}
                        <div className="relative px-4 py-2 text-xs font-medium text-gray-600 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                            <span className="relative z-10">Select Language</span>
                        </div>

                        <div className="py-1">
                            {languages.map((language) => (
                                <Menu.Item key={language.code}>
                                    {({ active }) => (
                                        <motion.button
                                            onClick={() => setLanguage(language.code)}
                                            whileHover={{ x: 2 }}
                                            className={`relative ${active ? 'bg-white/10 text-gray-900' : 'text-gray-700'}
                                                     ${currentLanguage === language.code ? 'bg-blue-500/10 backdrop-blur-sm' : ''}
                                                     group flex w-full items-center px-4 py-2.5 text-sm`}
                                        >
                                            {/* Selected item highlight */}
                                            {currentLanguage === language.code && (
                                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500/70 backdrop-blur-sm"></div>
                                            )}

                                            <div className="relative z-10 flex items-center w-full">
                                                <span className="mr-3 text-lg flex items-center justify-center w-8 h-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">{language.flag}</span>
                                                <span className="flex-1">{language.name}</span>
                                                {currentLanguage === language.code && (
                                                    <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm">
                                                        <CheckIcon className="h-3.5 w-3.5 text-blue-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
