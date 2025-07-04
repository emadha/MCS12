import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = ({
  children,
  className = '',
  count = 10, // Number of floating elements
  minSize = 20, // Minimum size in pixels
  maxSize = 80, // Maximum size in pixels
  colors = ['bg-accent/10', 'bg-accent/20', 'bg-accent-light/15', 'bg-accent-dark/10'],
  shapes = ['circle', 'square'], // 'circle' or 'square'
  speed = 1, // Animation speed multiplier
}) => {
  // Generate random floating elements
  const elements = Array.from({ length: count }).map((_, index) => {
    // Random properties for each element
    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-md';

    // Random position
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;

    // Random animation duration (3-8 seconds, adjusted by speed)
    const duration = (3 + Math.random() * 5) / speed;

    // Random animation delay
    const delay = Math.random() * 2;

    // Animation distance (20-50px)
    const distance = 20 + Math.random() * 30;

    // Random direction (up or down)
    const direction = Math.random() > 0.5 ? -1 : 1;

    return (
      <motion.div
        key={index}
        className={`absolute ${color} ${shapeClass} pointer-events-none`}
        style={{
          width: size,
          height: size,
          top,
          left,
        }}
        animate={{
          y: [0, direction * distance, 0],
          rotate: [0, Math.random() * 20 - 10],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  });

  return (
    <div className={`relative ${className}`}>
      {/* Floating elements in the background */}
      {elements}

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default FloatingElements;
