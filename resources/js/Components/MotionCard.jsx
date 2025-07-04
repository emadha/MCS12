import { motion } from 'framer-motion';

/**
 * MotionCard - An animated card component with hover effects
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.animationType - Animation type ('lift', 'glow', 'scale', 'tilt')
 */
const MotionCard = ({
  children,
  className = '',
  animationType = 'lift'
}) => {
  // Different hover animations
  const animations = {
    lift: {
      rest: { y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
      hover: { y: -8, transition: { duration: 0.2, ease: 'easeOut' } }
    },
    glow: {
      rest: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: { duration: 0.2, ease: 'easeOut' }
      },
      hover: {
        boxShadow: '0 0 15px 2px rgba(79, 70, 229, 0.3)',
        transition: { duration: 0.2, ease: 'easeOut' }
      }
    },
    scale: {
      rest: { scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
      hover: { scale: 1.03, transition: { duration: 0.2, ease: 'easeOut' } }
    },
    tilt: {
      rest: { rotate: 0, transition: { duration: 0.2, ease: 'easeOut' } },
      hover: { rotate: 1, transition: { duration: 0.2, ease: 'easeOut' } }
    }
  };

  const selectedAnimation = animations[animationType];

  // Base card styles
  const baseClasses = 'bg-white rounded-lg shadow-md transition-all p-6 ' + className;

  return (
    <motion.div
      className={baseClasses}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={selectedAnimation}
    >
      {children}
    </motion.div>
  );
};

export default MotionCard;
