import React from 'react';
import { motion } from 'framer-motion';

const MovingGradientBackground = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main gradient orbs */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-accent/30 to-accent-light/30 blur-3xl"
        style={{ top: '-10%', left: '30%' }}
        animate={{
          x: ['-5%', '5%', '-5%'],
          y: ['-5%', '10%', '-5%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"
        style={{ bottom: '-20%', right: '20%' }}
        animate={{
          x: ['5%', '-5%', '5%'],
          y: ['5%', '-5%', '5%'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-accent-light/20 to-primary/20 blur-3xl"
        style={{ top: '30%', left: '-10%' }}
        animate={{
          x: ['0%', '10%', '0%'],
          y: ['0%', '5%', '0%'],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default MovingGradientBackground;
