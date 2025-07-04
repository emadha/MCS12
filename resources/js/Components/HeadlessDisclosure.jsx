import { Disclosure } from '@headlessui/react';

const HeadlessDisclosure = ({ defaultOpen = false, className = '', children, ...props }) => {
  return (
    <Disclosure defaultOpen={defaultOpen} as="div" className={className} {...props}>
      {children}
    </Disclosure>
  );
};

HeadlessDisclosure.Button = ({ className = '', children, ...props }) => {
  return (
    <Disclosure.Button
      className={`flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 ${className}`}
      {...props}
    >
      {children}
    </Disclosure.Button>
  );
};

HeadlessDisclosure.Panel = ({ className = '', children, ...props }) => {
  return (
    <Disclosure.Panel
      className={`px-4 pt-4 pb-2 text-sm text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </Disclosure.Panel>
  );
};

export default HeadlessDisclosure;
