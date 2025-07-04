import React from 'react';
import { motion } from 'framer-motion';

const FadeInSection = ({
  children,
  className = '',
  direction = 'up',  // up, down, left, right
  delay = 0,
  duration = 0.5,
  threshold = 0.1,  // Visibility threshold to trigger animation
  ...props
}) => {
  // Define initial and animate states based on direction
  const getDirectionValues = () => {
    switch (direction) {
      case 'up':
        return { initial: { y: 40 }, animate: { y: 0 } };
      case 'down':
        return { initial: { y: -40 }, animate: { y: 0 } };
      case 'left':
        return { initial: { x: 40 }, animate: { x: 0 } };
      case 'right':
        return { initial: { x: -40 }, animate: { x: 0 } };
      default:
        return { initial: { y: 40 }, animate: { y: 0 } };
    }
  };

  const { initial, animate } = getDirectionValues();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initial }}
      whileInView={{ opacity: 1, ...animate }}
      viewport={{ once: true, threshold }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
