import React from 'react';
import { motion } from 'framer-motion';

// Main component that wraps the list
const AnimatedList = ({
  children,
  className = '',
  staggerDelay = 0.05,
  ...props
}) => {
  // Configure animations for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-2 ${className}`}
      {...props}
    >
      {/* Map children to ensure they inherit animation variants */}
      {React.Children.map(children, (child, index) => {
        return React.isValidElement(child)
          ? React.cloneElement(child, {
              ...child.props,
              variants: child.props.variants || itemVariants,
              // For accessibility
              'aria-setsize': React.Children.count(children),
              'aria-posinset': index + 1,
            })
          : child;
      })}
    </motion.ul>
  );
};

// Default animation for list items
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

// Item subcomponent
AnimatedList.Item = ({
  children,
  className = '',
  variants = itemVariants,
  ...props
}) => {
  return (
    <motion.li
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.li>
  );
};

export default AnimatedList;
