import HeadlessListbox from './HeadlessListbox';
import { Fragment, useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export default function SelectInput({ className = '', value, onChange, options = [], placeholder = 'Select an option', ...props }) {
    const [selectedValue, setSelectedValue] = useState(value);

    const handleChange = (newValue) => {
        setSelectedValue(newValue);
        if (onChange) {
            // Create a mock event to simulate standard select onChange
            const mockEvent = {
                target: {
                    value: newValue,
                    name: props.name || ''
                }
            };
            onChange(mockEvent);
        }
    };

    // If the component is used in a traditional way with children as options
    if (!options.length && props.children) {
        options = Array.isArray(props.children)
            ? props.children.map(child => ({
                value: child.props.value,
                label: child.props.children
              }))
            : [{ value: props.children.props.value, label: props.children.props.children }];
        delete props.children;
    }

    const displayValue = options.find(option => option.value === selectedValue)?.label || placeholder;

    return (
        <HeadlessListbox value={selectedValue} onChange={handleChange} {...props}>
            <div className={`relative ${className}`}>
                <HeadlessListbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-accent sm:text-sm sm:leading-6">
                    <span className="block truncate">{displayValue}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </HeadlessListbox.Button>
                <HeadlessListbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {options.map((option) => (
                        <HeadlessListbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-accent text-white' : 'text-gray-900'}`
                            }
                        >
                            {({ selected, active }) => (
                                <>
                                    <span
                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                    >
                                        {option.label}
                                    </span>
                                    {selected ? (
                                        <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-accent'}`}
                                        >
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    ) : null}
                                </>
                            )}
                        </HeadlessListbox.Option>
                    ))}
                </HeadlessListbox.Options>
            </div>
        </HeadlessListbox>
    );
}
