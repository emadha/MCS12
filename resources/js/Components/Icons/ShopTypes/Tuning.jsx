import React from 'react';

const TuningIcon = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 20v-7" />
      <path d="M7 20v-9" />
      <path d="M17 13a5 5 0 0 0-10 0" />
      <path d="M12 4V2" />
      <path d="M10 4h4" />
      <path d="M17 20h-2" />
      <path d="M9 20H7" />
    </svg>
  );
};

export default TuningIcon;
