import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MotionMenu - An animated dropdown menu component built with Framer Motion
 *
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - The trigger element that opens the menu
 * @param {React.ReactNode} props.children - Menu items or content
 * @param {string} props.align - Menu alignment ('left', 'right')
 * @param {string} props.width - Menu width (default: 'w-48')
 * @param {string} props.animation - Animation style ('scale', 'slide', 'fade')
 */
const MotionMenu = ({
  trigger,
  children,
  align = 'right',
  width = 'w-48',
  animation = 'scale'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Animation variants for different animation styles
  const animations = {
    scale: {
      initial: { opacity: 0, scale: 0.95, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      animate: { opacity: 1, scale: 1, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      exit: { opacity: 0, scale: 0.95, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      transition: { type: 'spring', stiffness: 350, damping: 25 }
    },
    slide: {
      initial: { opacity: 0, y: -10, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      animate: { opacity: 1, y: 0, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      exit: { opacity: 0, y: -10, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    fade: {
      initial: { opacity: 0, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      animate: { opacity: 1, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      exit: { opacity: 0, transformOrigin: align === 'left' ? 'top left' : 'top right' },
      transition: { duration: 0.15 }
    }
  };

  const selectedAnimation = animations[animation];

  // Alignment classes for positioning the menu
  const alignmentClasses = align === 'left' ? 'origin-top-left left-0' : 'origin-top-right right-0';

  // Toggle menu open/closed
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when clicking outside
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* Trigger element with click handler */}
      <div onClick={toggleMenu} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu overlay for clicking outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu}></div>
      )}

      {/* Animated menu content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-50 mt-2 ${width} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${alignmentClasses}`}
            initial={selectedAnimation.initial}
            animate={selectedAnimation.animate}
            exit={selectedAnimation.exit}
            transition={selectedAnimation.transition}
          >
            <div className="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Menu item component with hover animation
MotionMenu.Item = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      className={`w-full block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${className}`}
      onClick={onClick}
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)', dark: { backgroundColor: 'rgba(255,255,255,0.05)' } }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default MotionMenu;
