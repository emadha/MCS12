import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const HeadlessPopover = ({ className = '', children, ...props }) => {
  return (
    <Popover className={`relative ${className}`} {...props}>
      {children}
    </Popover>
  );
};

HeadlessPopover.Button = ({ className = '', children, ...props }) => {
  return (
    <Popover.Button
      className={`inline-flex items-center gap-x-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </Popover.Button>
  );
};

HeadlessPopover.Panel = ({ className = '', children, ...props }) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <Popover.Panel
        className={`absolute z-10 mt-3 w-screen max-w-md transform px-4 sm:px-0 lg:max-w-3xl ${className}`}
        {...props}
      >
        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="relative grid gap-8 bg-white p-7">
            {children}
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  );
};

export default HeadlessPopover;
