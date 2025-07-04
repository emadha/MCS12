import { Fragment, useState } from 'react';
import { Menu, Transition, RadioGroup } from '@headlessui/react';
import { useTheme, MODES, COLOR_SCHEMES } from '@/Utils/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';

// Helper function to get the appropriate color class for the color indicator
function getColorClass(colorScheme, mode) {
    const isDark = mode === 'dark';

    switch(colorScheme) {
        case COLOR_SCHEMES.DEFAULT:
            return isDark ? 'bg-slate-800 border-blue-700' : 'bg-blue-100 border-blue-500';
        case COLOR_SCHEMES.SUNSET:
            return isDark ? 'bg-orange-900 border-orange-700' : 'bg-orange-100 border-orange-500';
        case COLOR_SCHEMES.NEOMINT:
            return isDark ? 'bg-emerald-900 border-emerald-700' : 'bg-emerald-100 border-emerald-500';
        case COLOR_SCHEMES.AMETHYST:
            return isDark ? 'bg-purple-900 border-purple-700' : 'bg-purple-100 border-purple-500';
        case COLOR_SCHEMES.ROSE:
            return isDark ? 'bg-rose-900 border-rose-700' : 'bg-rose-100 border-rose-500';
        case COLOR_SCHEMES.MIDNIGHT:
            return 'bg-indigo-900 border-indigo-700';
        case COLOR_SCHEMES.SLATE:
            return 'bg-slate-800 border-slate-700';
        case COLOR_SCHEMES.TEAL:
            return isDark ? 'bg-teal-900 border-teal-700' : 'bg-teal-100 border-teal-500';
        default:
            return isDark ? 'bg-slate-800 border-blue-700' : 'bg-blue-100 border-blue-500';
    }
}

export default function ThemeSelector() {
    const {
        mode,
        setMode,
        colorScheme,
        setColorScheme,
        effectiveMode,
        systemTheme,
        MODES,
        COLOR_SCHEMES
    } = useTheme();

    // Define the mode options
    const modeOptions = [
        {
            name: 'System',
            value: MODES.SYSTEM,
            icon: ComputerDesktopIcon,
            description: `Use system setting (currently ${systemTheme === 'dark' ? 'Dark' : 'Light'})`
        },
        {
            name: 'Light',
            value: MODES.LIGHT,
            icon: SunIcon,
            description: 'Light mode'
        },
        {
            name: 'Dark',
            value: MODES.DARK,
            icon: MoonIcon,
            description: 'Dark mode'
        },
    ];

    // Define color schemes for each mode
    const getColorSchemes = () => {
        const isDarkMode = effectiveMode === 'dark';
        return [
            {
                name: 'Ocean Breeze',
                value: COLOR_SCHEMES.DEFAULT,
                description: isDarkMode ? 'Midnight Ocean theme' : 'Ocean Breeze theme'
            },
            {
                name: 'Sunset',
                value: COLOR_SCHEMES.SUNSET,
                description: isDarkMode ? 'Amber Sunset theme' : 'Sunset Glow theme'
            },
            {
                name: 'Emerald',
                value: COLOR_SCHEMES.NEOMINT,
                description: isDarkMode ? 'Emerald Night theme' : 'Neo Mint theme'
            },
            {
                name: 'Amethyst',
                value: COLOR_SCHEMES.AMETHYST,
                description: isDarkMode ? 'Mystic Amethyst theme' : 'Amethyst Dream theme'
            },
            {
                name: 'Rose',
                value: COLOR_SCHEMES.ROSE,
                description: isDarkMode ? 'Crimson Night theme' : 'Rose Gold theme'
            },
            {
                name: 'Teal',
                value: COLOR_SCHEMES.TEAL,
                description: isDarkMode ? 'Twilight Teal theme' : 'Teal Breeze theme'
            },
            ...(!isDarkMode ? [] : [
                {
                    name: 'Cosmic Indigo',
                    value: COLOR_SCHEMES.MIDNIGHT,
                    description: 'Deep indigo-based dark theme'
                },
                {
                    name: 'Dark Slate',
                    value: COLOR_SCHEMES.SLATE,
                    description: 'Minimal slate-based dark theme'
                }
            ])
        ];
    };

    // Get the current mode icon
    const currentModeObj = modeOptions.find(m => m.value === mode);
    const CurrentModeIcon = currentModeObj?.icon || SwatchIcon;

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-full
                               text-gray-500 hover:bg-gray-100 focus:outline-none
                               focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-accent">
                    <span className="sr-only">Select theme</span>
                    <CurrentModeIcon className="h-5 w-5" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white
                                  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                                  border border-gray-200">
                    <div className="py-1">
                        {/* Mode Selection */}
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
                            Choose Mode
                        </div>

                        <RadioGroup value={mode} onChange={setMode} className="p-3 border-b border-gray-200">
                            <div className="flex justify-between space-x-2">
                                {modeOptions.map((modeOption) => {
                                    const Icon = modeOption.icon;
                                    return (
                                        <RadioGroup.Option
                                            key={modeOption.value}
                                            value={modeOption.value}
                                            className={({ active, checked }) =>
                                                `${checked ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                                                ${active ? 'ring-2 ring-blue-500' : ''}
                                                relative flex-1 flex flex-col items-center rounded-lg border p-3 cursor-pointer focus:outline-none`
                                            }
                                        >
                                            {({ checked }) => (
                                                <>
                                                    <Icon className={`h-7 w-7 ${checked ? 'text-blue-500' : 'text-gray-500'}`} />
                                                    <RadioGroup.Label className={`mt-2 text-sm font-medium ${checked ? 'text-blue-700' : 'text-gray-700'}`}>
                                                        {modeOption.name}
                                                    </RadioGroup.Label>
                                                </>
                                            )}
                                        </RadioGroup.Option>
                                    );
                                })}
                            </div>
                        </RadioGroup>

                        {/* Color Scheme Selection */}
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
                            Color Scheme
                        </div>

                        <RadioGroup value={colorScheme} onChange={setColorScheme} className="p-3">
                            <div className="grid grid-cols-1 gap-3">
                                {getColorSchemes().map((scheme) => (
                                    <RadioGroup.Option
                                        key={scheme.value}
                                        value={scheme.value}
                                        className={({ active, checked }) =>
                                            `${checked ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                                            ${active ? 'ring-2 ring-blue-500' : ''}
                                            relative flex items-center rounded-lg border p-2 cursor-pointer focus:outline-none`
                                        }
                                    >
                                        {({ checked }) => (
                                            <>
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className={`h-5 w-5 rounded-full border ${getColorClass(scheme.value, effectiveMode)}`}></div>
                                                        <div className="ml-3">
                                                            <RadioGroup.Label className={`text-sm font-medium ${checked ? 'text-blue-700' : 'text-gray-700'}`}>
                                                                {scheme.name}
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description className="text-xs text-gray-500">
                                                                {scheme.description}
                                                            </RadioGroup.Description>
                                                        </div>
                                                    </div>
                                                    {checked && (
                                                        <div className="shrink-0 text-blue-500">
                                                            <CheckIcon className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </RadioGroup.Option>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
