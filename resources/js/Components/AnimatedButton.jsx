import { motion } from 'framer-motion';
import { hoverScale } from './Animations';
import React from 'react';

const AnimatedButton = ({
  children,
  type = 'button',
  className = '',
  disabled = false,
  onClick,
  variant = 'primary',  // primary, secondary, danger
  ...props
}) => {
  // Define variant-specific classes
  const variantClasses = {
    primary: 'bg-button-primary text-on-accent hover-bg-button-primary-hover focus-ring-accent',
    secondary: 'bg-button-secondary text-[rgb(var(--color-button-secondary-text))] hover-bg-button-secondary-hover focus-ring-accent border border-[rgb(var(--color-button-secondary-border))]',
    danger: 'bg-[rgb(var(--color-error))] text-on-accent hover:bg-[rgb(var(--color-error))/90] focus:ring-[rgb(var(--color-error))]',
  };

  return (
    <motion.button
      type={type}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
/**
 * An animated button component with hover and tap effects
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler
 * @param {string} props.variant - Button variant (primary, secondary, danger)
 */
