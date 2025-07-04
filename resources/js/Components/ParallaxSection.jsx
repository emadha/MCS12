import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxSection = ({
  children,
  backgroundImage,
  speed = 0.3, // Parallax speed factor (0-1) with 0 being no parallax
  className = '',
  overlayOpacity = 0.5, // Overlay darkness (0-1)
  reverse = false, // Reverse the parallax direction
}) => {
  const { scrollYProgress } = useScroll();

  // Calculate parallax effect based on scroll position
  const yValue = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ['0%', `${speed * -50}%`] : ['0%', `${speed * 50}%`]
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background with parallax effect */}
      {backgroundImage && (
        <>
          <motion.div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              y: yValue,
              scale: 1.2, // Slightly larger to prevent gaps during parallax
            }}
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
