import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCog, faImage, faInfoCircle, faMoneyBill, faShop, faTag, faUser } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '@/AppContext';
import { Transition } from '@headlessui/react';

export default function ListingOptions({ defaultOptions, onChange }) {
    const { lang } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState(defaultOptions || {
        showThumbnail: true,
        thumbnailSize: 'medium',
        showTitle: true,
        showDescription: true,
        showPrice: true,
        showLocation: true,
        showShop: true,
        showUser: true,
        showPromoted: true,
        showSoldBadge: true,
        hideBody: false
    });

    const handleOptionChange = (key, value) => {
        const newOptions = { ...options, [key]: value };
        setOptions(newOptions);
        if (onChange) {
            onChange(newOptions);
        }
    };

    const OptionToggle = ({ icon, label, option }) => {
        return (
            <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center">
                    {icon && <FontAwesomeIcon icon={icon} className="mr-2 text-neutral-500" />}
                    <span>{label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={options[option]}
                        onChange={(e) => handleOptionChange(option, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                </label>
            </div>
        );
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title={lang('Display Options')}
            >
                <FontAwesomeIcon icon={faCog} />
                <span className="hidden sm:inline">{lang('Options')}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <Transition
                show={isOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div className="absolute right-0 z-10 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-md shadow-lg p-4">
                    <h3 className="font-bold mb-2 pb-2 border-b dark:border-neutral-700">{lang('Display Options')}</h3>

                    <OptionToggle icon={faImage} label={lang('Show Thumbnail')} option="showThumbnail" />

                    {options.showThumbnail && (
                        <div className="ml-6 mt-2 mb-2">
                            <label className="block text-sm mb-1">{lang('Thumbnail Size')}:</label>
                            <select
                                className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 rounded"
                                value={options.thumbnailSize}
                                onChange={(e) => handleOptionChange('thumbnailSize', e.target.value)}
                            >
                                <option value="small">{lang('Small')}</option>
                                <option value="medium">{lang('Medium')}</option>
                                <option value="large">{lang('Large')}</option>
                            </select>
                        </div>
                    )}

                    <OptionToggle icon={faTag} label={lang('Show Title')} option="showTitle" />
                    <OptionToggle icon={faInfoCircle} label={lang('Show Description')} option="showDescription" />
                    <OptionToggle icon={faMoneyBill} label={lang('Show Price')} option="showPrice" />
                    <OptionToggle icon={faShop} label={lang('Show Shop')} option="showShop" />
                    <OptionToggle icon={faUser} label={lang('Show User')} option="showUser" />
                    <OptionToggle label={lang('Show Promoted Badge')} option="showPromoted" />
                    <OptionToggle label={lang('Show Sold Badge')} option="showSoldBadge" />
                    <OptionToggle label={lang('Show Location')} option="showLocation" />

                    <div className="mt-4 pt-2 border-t dark:border-neutral-700 text-right">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            {lang('Apply')}
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
}
