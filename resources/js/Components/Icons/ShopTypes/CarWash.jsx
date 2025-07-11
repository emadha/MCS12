import React from 'react';

const CarWashIcon = ({ className = 'w-6 h-6' }) => {
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
      <path d="M19 17h2l.64-2.54c.24-.959.24-1.962 0-2.92l-1.07-4.27A3 3 0 0 0 17.66 5H4.34A3 3 0 0 0 1.43 7.27L.36 11.54a4.006 4.006 0 0 0 0 2.92L1 17h2" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="15.5" cy="17.5" r="2.5" />
      <path d="M5 10h14" />
      <path d="M6 6l4 4" />
      <path d="M14 6l4 4" />
      <path d="M6 2v4" />
      <path d="M18 2v4" />
    </svg>
  );
};

export default CarWashIcon;
