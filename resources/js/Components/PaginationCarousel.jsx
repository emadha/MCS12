import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import useSwipe from './hooks/useSwipe';

/**
 * PaginationCarousel component for displaying items in paginated carousel format
 *
 * @param {Object} props
 * @param {Array} props.items - Array of items to display
 * @param {number} props.itemsPerPage - Number of items to show per page
 * @param {function} props.renderItem - Function to render each item
 * @param {string} props.className - Additional class names for the container
 * @param {string} props.gridClasses - Custom grid classes for the item container
 * @param {boolean} props.autoplay - Whether to autoplay the carousel
 * @param {number} props.autoplaySpeed - Speed of autoplay in milliseconds
 * @param {boolean} props.showDots - Whether to show pagination dots
 * @param {boolean} props.enableSwipe - Whether to enable swipe gestures for navigation
 */
export default function PaginationCarousel({
  items = [],
  itemsPerPage = 3,
  renderItem,
  className = '',
  gridClasses = '',
  autoplay = false,
  autoplaySpeed = 5000,
  showDots = true,
  enableSwipe = true,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  // Handle autoplay
  useEffect(() => {
    if (!autoplay || autoplayPaused) return;

    const interval = setInterval(() => {
      nextPage();
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [currentPage, autoplay, autoplaySpeed, autoplayPaused]);

  // Navigation functions
  const nextPage = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const prevPage = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  // Get current items
  const getCurrentItems = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

      // Initialize swipe functionality
      const { touchRef, isActive: isSwipeActive } = useSwipe({
    onSwipeLeft: nextPage,
    onSwipeRight: prevPage,
    threshold: 50,
    timeout: 500,
      });

      // Pause autoplay during swipe and resume after
      useEffect(() => {
    if (isSwipeActive) {
      setAutoplayPaused(true);
    } else {
      // Resume autoplay after a short delay
      const timer = setTimeout(() => setAutoplayPaused(false), 1000);
      return () => clearTimeout(timer);
    }
      }, [isSwipeActive]);

      return (
    <div className={`w-full ${className}`}>
      {enableSwipe && totalPages > 1 && (
        <div className="hidden sm:flex items-center justify-center mb-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Swipe to navigate</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      )}
      <div className={`relative overflow-hidden transition-all duration-200 ${isSwipeActive ? 'scale-[0.98]' : ''}`} ref={enableSwipe ? touchRef : null}>
        {/* Carousel content */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <div className={`grid ${gridClasses || 'grid-cols-1 md:grid-cols-3'} gap-6`}>
              {getCurrentItems().map((item, index) => (
                <div key={index} className="w-full">
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={prevPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none z-10"
              aria-label="Previous page"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
            <button
              onClick={nextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none z-10"
              aria-label="Next page"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots */}
      {showDots && totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentPage ? 1 : -1);
                setCurrentPage(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentPage === index
                  ? 'bg-blue-500 w-5'
                  : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
