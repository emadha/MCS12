import { motion } from 'framer-motion';

/**
 * AnimatedDialogContent - A component for animated dialog or modal content
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Dialog content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.animation - Animation style ('slide', 'zoom', 'flip', 'fade')
 */
const AnimatedDialogContent = ({
  children,
  className = '',
  animation = 'slide'
}) => {
  // Different animation variants for dialog content
  const animations = {
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { type: 'spring', stiffness: 400, damping: 30 }
    },
    zoom: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    flip: {
      initial: { opacity: 0, rotateX: 10 },
      animate: { opacity: 1, rotateX: 0 },
      exit: { opacity: 0, rotateX: 10 },
      transition: { duration: 0.3 }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    }
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      className={className}
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      exit={selectedAnimation.exit}
      transition={selectedAnimation.transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedDialogContent;
