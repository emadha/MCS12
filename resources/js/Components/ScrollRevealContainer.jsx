import React from 'react';
import { motion } from 'framer-motion';

const ScrollRevealContainer = ({
  children,
  className = '',
  staggerChildren = 0.1,
  staggerDirection = 1, // 1 for forward, -1 for backward
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        staggerDirection,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

// Item component to be used within the container
ScrollRevealContainer.Item = ({
  children,
  className = '',
  direction = 'up', // 'up', 'down', 'left', 'right'
}) => {
  // Determine animation direction
  const getDirectionVariants = () => {
    switch (direction) {
      case 'up':
        return { hidden: { y: 50 }, visible: { y: 0 } };
      case 'down':
        return { hidden: { y: -50 }, visible: { y: 0 } };
      case 'left':
        return { hidden: { x: -50 }, visible: { x: 0 } };
      case 'right':
        return { hidden: { x: 50 }, visible: { x: 0 } };
      default:
        return { hidden: { y: 50 }, visible: { y: 0 } };
    }
  };

  const directionVariants = getDirectionVariants();

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...directionVariants.hidden,
    },
    visible: {
      opacity: 1,
      ...directionVariants.visible,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealContainer;
