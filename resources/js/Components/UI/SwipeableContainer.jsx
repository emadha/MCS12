import React from 'react';
import useSwipe from '@/Components/hooks/useSwipe';

/**
 * A container component that detects swipe gestures and triggers callbacks
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSwipeLeft - Callback when user swipes left
 * @param {Function} props.onSwipeRight - Callback when user swipes right
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.threshold - Swipe distance threshold (default: 50px)
 * @param {boolean} props.showIndicators - Whether to show swipe indicators
 * @param {boolean} props.canSwipeLeft - Whether left swipe is allowed
 * @param {boolean} props.canSwipeRight - Whether right swipe is allowed
 */
export default function SwipeableContainer({
  onSwipeLeft,
  onSwipeRight,
  children,
  className = '',
  threshold = 50,
  showIndicators = true,
  canSwipeLeft = true,
  canSwipeRight = true,
}) {
  const { touchRef } = useSwipe({
    onSwipeLeft: canSwipeLeft ? onSwipeLeft : undefined,
    onSwipeRight: canSwipeRight ? onSwipeRight : undefined,
    threshold,
    timeout: 500,
  });

  return (
    <div
      ref={touchRef}
      className={`relative ${className}`}
      data-testid="swipeable-container"
    >
      {showIndicators && (
        <>
          {canSwipeRight && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-primary/50 text-4xl opacity-30 z-10 pointer-events-none">
              ‹
            </div>
          )}
          {canSwipeLeft && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-primary/50 text-4xl opacity-30 z-10 pointer-events-none">
              ›
            </div>
          )}
        </>
      )}
      {children}
    </div>
  );
}
