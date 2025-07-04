import { useState, Fragment } from 'react';
import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { dropdownAnimation } from './Animations';

/**
 * An animated dropdown menu component
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.trigger - Element that triggers the dropdown
 * @param {ReactNode} props.children - Dropdown content
 * @param {string} props.align - Alignment of dropdown (right, left)
 * @param {string} props.width - Width of dropdown (default, sm, md, lg)
 * @param {string} props.contentClasses - Additional classes for dropdown content
 */
const AnimatedDropdown = ({
  trigger,
  children,
  align = 'right',
  width = 'w-48',
  contentClasses = 'py-1 bg-white',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const alignmentClasses = {
    left: 'origin-top-left left-0',
    right: 'origin-top-right right-0',
  }[align];

  const widthClasses = {
    default: width,
    sm: 'w-40',
    md: 'w-48',
    lg: 'w-56',
  }[width] || width;

  return (
    <Menu as="div" className="relative">
      {({ open }) => {
        if (open !== isOpen) setIsOpen(open);
        return (
          <>
            <Menu.Button as={Fragment}>{trigger}</Menu.Button>

            <AnimatePresence>
              {isOpen && (
                <Menu.Items
                  static
                  as={motion.div}
                  variants={dropdownAnimation}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                >
                  <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}>
                    {children}
                  </div>
                </Menu.Items>
              )}
            </AnimatePresence>
          </>
        );
      }}
    </Menu>
  );
};

export default AnimatedDropdown;
