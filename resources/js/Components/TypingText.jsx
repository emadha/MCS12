import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const TypingText = ({
  text,
  className = '',
  typingSpeed = 150,
  startDelay = 0,
  cursorBlinkSpeed = 500,
  showCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    let timeout;

    // Start the typing after the initial delay
    timeout = setTimeout(() => {
      setIsTyping(true);
      typeText();
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [text]);

  useEffect(() => {
    let interval;

    if (showCursor) {
      interval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, cursorBlinkSpeed);
    }

    return () => clearInterval(interval);
  }, [cursorBlinkSpeed, showCursor]);

  const typeText = () => {
    let currentIndex = 0;
    const textLength = text.length;

    const interval = setInterval(() => {
      if (currentIndex < textLength) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        controls.start({
          opacity: 1,
          transition: { duration: 0.5 }
        });
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  };

  return (
    <motion.div className={`inline-flex ${className}`} animate={controls}>
      <span>{displayedText}</span>
      {showCursor && (
        <motion.span
          animate={{ opacity: cursorVisible ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className={isTyping ? 'opacity-100' : ''}
        >
          |
        </motion.span>
      )}
    </motion.div>
  );
};

export default TypingText;
