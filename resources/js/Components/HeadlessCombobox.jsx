import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

const HeadlessCombobox = ({ value, onChange, options = [], className = '', children, ...props }) => {
  const [query, setQuery] = useState('');

  const filteredOptions = query === ''
    ? options
    : options.filter((option) => {
        return option.label.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <Combobox value={value} onChange={onChange} {...props}>
      {({ open }) => (
        <div className={`relative ${className}`}>
          {children({ filteredOptions, query, setQuery, open })}
        </div>
      )}
    </Combobox>
  );
};

HeadlessCombobox.Input = ({ className = '', onChange, ...props }) => {
  return (
    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
      <Combobox.Input
        className={`w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 ${className}`}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Combobox.Button>
    </div>
  );
};

HeadlessCombobox.Options = ({ className = '', children, ...props }) => {
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={() => {}}
    >
      <Combobox.Options
        className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${className}`}
        {...props}
      >
        {children}
      </Combobox.Options>
    </Transition>
  );
};

HeadlessCombobox.Option = ({ value, className = '', children, ...props }) => {
  return (
    <Combobox.Option
      value={value}
      as={Fragment}
      {...props}
    >
      {({ active, selected }) => (
        <li
          className={`relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'} ${className}`}
        >
          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
            {children}
          </span>
          {selected && (
            <span
              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'}`}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </li>
      )}
    </Combobox.Option>
  );
};

export default HeadlessCombobox;
