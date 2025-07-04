/**
 * GlobalThemeUtils.js
 *
 * A collection of utility functions and constants for working with themes across the application.
 * This provides reusable styling functions that can be imported by any component.
 */

// Card styles for consistent theming across the application
export const cardStyles = {
  base: 'bg-primary border border-border-primary rounded-lg shadow-theme overflow-hidden',
  header: 'px-6 py-4 bg-secondary border-b border-border-primary',
  body: 'p-6',
  footer: 'px-6 py-4 bg-tertiary border-t border-border-primary',
};

// Button variations beyond the standard Primary and Secondary buttons
export const buttonStyles = {
  success: 'bg-success text-white hover:bg-success/90 focus:ring-success/50',
  danger: 'bg-error text-white hover:bg-error/90 focus:ring-error/50',
  warning: 'bg-warning text-gray-900 hover:bg-warning/90 focus:ring-warning/50',
  info: 'bg-info text-white hover:bg-info/90 focus:ring-info/50',
  outline: 'bg-transparent border border-border-secondary text-primary hover:bg-secondary',
  text: 'bg-transparent text-accent hover:text-accent/80 hover:underline',
};

// Badge styles for status indicators
export const badgeStyles = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
};

// Table styles
export const tableStyles = {
  base: 'min-w-full divide-y divide-border-primary',
  thead: 'bg-secondary',
  th: 'px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider',
  tbody: 'bg-primary divide-y divide-border-primary',
  td: 'px-6 py-4 whitespace-nowrap text-sm text-primary',
};

// Form element styles for consistent theming
export const formStyles = {
  group: 'mb-4',
  label: 'block font-medium text-sm text-primary mb-1',
  input: 'border-border-primary bg-primary text-primary focus:border-accent focus:ring-accent/20 rounded-md shadow-sm w-full',
  select: 'border-border-primary bg-primary text-primary focus:border-accent focus:ring-accent/20 rounded-md shadow-sm w-full',
  checkbox: 'rounded border-border-primary text-accent focus:ring-accent/20',
  radio: 'border-border-primary text-accent focus:ring-accent/20',
  error: 'text-sm text-error mt-1',
  hint: 'text-sm text-tertiary mt-1',
};

// Alert styles for notifications
export const alertStyles = {
  success: 'bg-green-50 border-l-4 border-green-500 text-green-800',
  error: 'bg-red-50 border-l-4 border-red-500 text-red-800',
  warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
  info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
};

// Avatar styles
export const avatarStyles = {
  base: 'rounded-full overflow-hidden flex-shrink-0',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

// Navigation styles
export const navStyles = {
  item: 'px-3 py-2 rounded-md text-sm font-medium',
  active: 'bg-accent text-white',
  inactive: 'text-primary hover:bg-secondary hover:text-accent',
};

// Utility function to merge theme styles with custom classes
export const mergeStyles = (baseStyles, customStyles) => {
  return `${baseStyles} ${customStyles || ''}`;
};

// Helper to get status color class based on status type
export const getStatusColorClass = (status, type = 'badge') => {
  const styles = type === 'badge' ? badgeStyles : alertStyles;

  switch (status.toLowerCase()) {
    case 'success':
    case 'active':
    case 'completed':
    case 'approved':
      return styles.success;
    case 'error':
    case 'failed':
    case 'rejected':
    case 'cancelled':
      return styles.error;
    case 'warning':
    case 'pending':
    case 'processing':
      return styles.warning;
    case 'info':
    case 'draft':
    case 'in progress':
      return styles.info;
    default:
      return styles.neutral || styles.info;
  }
};
