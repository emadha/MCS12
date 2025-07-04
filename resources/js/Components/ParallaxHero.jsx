import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import MovingGradientBackground from './MovingGradientBackground';

const ParallaxHero = ({
  title,
  subtitle,
  backgroundImage = '/images/hero-bg.jpg',
  height = '70vh',
  children,
  className = '',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: false, amount: 0.3 });
  const controls = useAnimation();

  // Parallax effect on scroll
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundScale = useTransform(scrollY, [0, 500], [1.2, 1.4]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const contentY = useTransform(scrollY, [0, 300], [0, 100]);

  // Particle animation states
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    // Generate random particles
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));

    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={heroRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background with parallax effect */}
      {isMounted && (
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            y: backgroundY,
            scale: backgroundScale,
          }}
          initial={{ scale: 1.3, filter: 'blur(8px)' }}
          animate={{ scale: 1.2, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 mix-blend-multiply"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Moving gradient background */}
      <MovingGradientBackground />

      {/* Particle effects */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.id % 2 === 0 ? 10 : -10, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Light beam effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/10 to-transparent"
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: [0, 0.3, 0], rotate: [-10, -5, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      {isMounted && (
        <motion.div
          className="relative h-full flex flex-col items-center justify-center text-center px-4 md:px-8 max-w-5xl mx-auto text-white z-10"
          style={{
            opacity: contentOpacity,
            y: contentY
          }}
        >
          <motion.div
            className="relative overflow-hidden inline-block mb-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
          >
            <motion.div
              className="absolute inset-0 bg-accent/20 backdrop-blur-sm rounded-lg -z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            {title.split('').map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                className="text-4xl md:text-7xl font-bold inline-block"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      damping: 12,
                      stiffness: 100
                    }
                  },
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: Math.random() * 10 - 5,
                  color: '#fff',
                  textShadow: '0 0 10px var(--color-accent-500)'
                }}
                style={{ transformOrigin: 'bottom' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>

          {subtitle && (
            <motion.div
              className="overflow-hidden relative mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.div
                className="absolute -inset-x-6 -inset-y-2 bg-gradient-to-r from-accent/10 via-accent/20 to-accent/10 rounded-lg blur-sm -z-10"
                animate={{ x: ['-5%', '5%', '-5%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.p
                className="text-xl md:text-2xl max-w-3xl font-light tracking-wide px-4 py-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                {subtitle}
              </motion.p>
            </motion.div>
          )}

          {children && (
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg blur-md -z-10"
                animate={{
                  boxShadow: ['0 0 10px rgba(var(--color-accent-600), 0.3)', '0 0 20px rgba(var(--color-accent-600), 0.6)', '0 0 10px rgba(var(--color-accent-600), 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {children}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Bottom wave animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 z-10 opacity-70"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z\' opacity=\'.25\' class=\'shape-fill\'%3E%3C/path%3E%3Cpath d=\'M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z\' opacity=\'.5\' class=\'shape-fill\'%3E%3C/path%3E%3Cpath d=\'M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z\' class=\'shape-fill\'%3E%3C/path%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        animate={{
          x: ['-10%', '0%', '-10%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

export default ParallaxHero;
