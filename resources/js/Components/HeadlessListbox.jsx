import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';

const HeadlessListbox = ({ value, onChange, options, className = '', children, ...props }) => {
  return (
    <Listbox value={value} onChange={onChange} {...props}>
      {children}
    </Listbox>
  );
};

HeadlessListbox.Button = ({ className = '', children, ...props }) => {
  return (
    <Listbox.Button
      className={`relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm ${className}`}
      {...props}
    >
      {children}
    </Listbox.Button>
  );
};

HeadlessListbox.Options = ({ className = '', children, ...props }) => {
  return (
    <Listbox.Options
      className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${className}`}
      {...props}
    >
      {children}
    </Listbox.Options>
  );
};

HeadlessListbox.Option = ({ value, className = '', children, ...props }) => {
  return (
    <Listbox.Option
      value={value}
      as={Fragment}
      {...props}
    >
      {({ active, selected }) => (
        <li
          className={`relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'} ${className}`}
        >
          {selected && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {children}
        </li>
      )}
    </Listbox.Option>
  );
};

export default HeadlessListbox;
