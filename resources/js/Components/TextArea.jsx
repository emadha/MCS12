import { Transition } from '@headlessui/react';

export default function TextArea({ className = '', ...props }) {
    return (
        <Transition
            appear={true}
            show={true}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <textarea
                {...props}
                className={
                    `border-border-primary bg-primary text-primary focus:border-accent focus:ring-accent/20 rounded-md shadow-sm ` +
                    className
                }
            />
        </Transition>
    );
}
