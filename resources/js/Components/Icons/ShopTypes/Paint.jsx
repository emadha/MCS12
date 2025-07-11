import React from 'react';

const PaintIcon = ({ className = 'w-6 h-6' }) => {
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
      <path d="M19 11h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2" />
      <path d="M4 11h15v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M4 11V7a1 1 0 0 1 1-1h5l2-3h5a1 1 0 0 1 1 1v7" />
      <path d="M8 16v1" />
      <path d="M12 16v1" />
      <path d="M16 16v1" />
    </svg>
  );
};

export default PaintIcon;
