import { motion } from 'framer-motion';

/**
 * AnimatedContainer - A wrapper component that adds consistent animations to its children
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be animated
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.variants - Custom animation variants
 * @param {string} props.animation - Animation preset ('fade', 'slide', 'pop', or 'none')
 * @param {Object} props.transition - Custom transition settings
 * @param {Object} props.layoutId - For shared layout animations
 * @param {Object} props.rest - Any other props to pass to the motion.div
 */
const AnimatedContainer = ({
  children,
  className = '',
  variants,
  animation = 'fade',
  transition,
  layoutId,
  ...rest
}) => {
  // Predefined animation variants
  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    pop: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
      transition: {}
    }
  };

  // Use custom variants or select from presets
  const selectedVariants = variants || animationVariants[animation];

  return (
    <motion.div
      className={className}
      initial={selectedVariants.initial}
      animate={selectedVariants.animate}
      exit={selectedVariants.exit}
      transition={transition || selectedVariants.transition}
      layoutId={layoutId}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
