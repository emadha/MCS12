import { motion } from 'framer-motion';
import { hoverScale, slideUpAnimation } from './Animations';

/**
 * A wrapper component that adds animations to any element
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child elements
 * @param {Object} props.animation - Animation variant object (default: slideUpAnimation)
 * @param {boolean} props.hover - Whether to add hover animation (default: false)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.as - Element type to render (default: div)
 * @param {Object} props.initial - Initial animation state (defaults to animation.hidden)
 * @param {Object} props.animate - Animation state (defaults to animation.visible)
 * @param {Object} props.exit - Exit animation state (defaults to animation.exit)
 * @param {Object} props.transition - Custom transition properties
 */
const MotionWrapper = ({
  children,
  animation = slideUpAnimation,
  hover = false,
  className = '',
  style = {},
  as = 'div',
  initial,
  animate,
  exit,
  transition,
  ...props
}) => {
  // Combine hover animation if enabled
  const animationProps = {
    initial: initial || animation.hidden,
    animate: animate || animation.visible,
    exit: exit || animation.exit,
    transition,
    ...(hover ? hoverScale : {}),
  };

  return (
    <motion.div
      className={className}
      style={style}
      {...animationProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
