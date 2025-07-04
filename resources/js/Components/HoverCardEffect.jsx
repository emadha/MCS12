import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const HoverCardEffect = ({
  children,
  className = '',
  glareOpacity = 0.1, // Light glare effect opacity
  perspective = 1000, // Perspective depth
  tiltFactor = 10, // How much the card tilts (higher means more tilt)
  glare = true, // Enable/disable glare effect
  shadow = true, // Enable/disable dynamic shadow
  ...props
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);

  // Handle mouse movement over the card
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Calculate cursor position relative to the card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate tilt based on cursor position
    const tiltX = ((e.clientY - centerY) / (rect.height / 2)) * tiltFactor;
    const tiltY = ((centerX - e.clientX) / (rect.width / 2)) * tiltFactor;

    // Update tilt state
    setTilt({ x: tiltX, y: tiltY });
  };

  // Reset tilt when mouse leaves
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        boxShadow: shadow && isHovering
          ? `0px ${Math.abs(tilt.x) * 0.2 + 8}px ${Math.abs(tilt.y) * 0.2 + 16}px rgba(0, 0, 0, 0.1)`
          : '0px 4px 6px rgba(0, 0, 0, 0.05)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Main content */}
      {children}

      {/* Glare effect */}
      {glare && (
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white/0 to-white pointer-events-none"
          style={{ mixBlendMode: 'overlay' }}
          animate={{
            opacity: isHovering ? glareOpacity : 0,
            // Position glare opposite to tilt direction
            backgroundPosition: `${50 + tilt.y * 2}% ${50 - tilt.x * 2}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        />
      )}
    </motion.div>
  );
};

export default HoverCardEffect;
