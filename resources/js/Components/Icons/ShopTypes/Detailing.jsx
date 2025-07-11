import React from 'react';

const DetailingIcon = ({ className = 'w-6 h-6' }) => {
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
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 6-6" />
      <circle cx="8" cy="9" r="2" />
      <path d="M2 12h2" />
      <path d="M2 8h2" />
      <path d="M2 4h2" />
      <path d="M2 16h2" />
      <path d="M2 20h2" />
    </svg>
  );
};

export default DetailingIcon;
