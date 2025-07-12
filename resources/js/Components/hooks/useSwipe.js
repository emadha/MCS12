import {useEffect, useRef, useState} from 'react';

/**
 * A custom hook for detecting swipe gestures
 *
 * @param {Object} options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {number} options.threshold - Minimum distance required for swipe (pixels)
 * @param {number} options.timeout - Maximum time allowed for swipe (ms)
 * @returns {Object} ref to be attached to the target element
 */
export default function useSwipe({
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    timeout = 300,
}) {
    const touchRef = useRef(null);
    const timeoutRef = useRef(null);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const startTimeRef = useRef(0);

    // Tracks if we're currently handling a touch/mouse sequence
    const [isActive, setIsActive] = useState(false);

    const handleTouchStart = (e) => {
        startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
        startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
        startTimeRef.current = Date.now();
        setIsActive(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a timeout to cancel the swipe if it takes too long
        timeoutRef.current = setTimeout(() => {
            setIsActive(false);
        }, timeout);
    };

    const handleTouchMove = (e) => {
        if (!isActive) return;

        // Calculate horizontal and vertical movement
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const diffX = currentX - startXRef.current;
        const diffY = currentY - startYRef.current;

        // Only prevent default if horizontal movement is greater than vertical
        // This prevents interference with vertical scrolling
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
        }
    };

    const handleTouchEnd = (e) => {
        if (!isActive) return;

        clearTimeout(timeoutRef.current);
        setIsActive(false);

        const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const diffX = endX - startXRef.current;
        const diffY = endY - startYRef.current;
        const elapsed = Date.now() - startTimeRef.current;

        // Only register as a swipe if movement was mostly horizontal
        const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY) * 2;

        // Check if the swipe meets our criteria
        if (elapsed < timeout && isHorizontalSwipe) {
            console.log(`Swipe detected: diffX=${diffX}, elapsed=${elapsed}ms, isHorizontal=${isHorizontalSwipe}`);
            if (diffX > threshold && onSwipeRight) {
                console.log('Executing right swipe callback');
                onSwipeRight();
            } else if (diffX < -threshold && onSwipeLeft) {
                console.log('Executing left swipe callback');
                onSwipeLeft();
            }
        } else {
            console.log(`Swipe rejected: diffX=${diffX}, elapsed=${elapsed}ms, isHorizontal=${isHorizontalSwipe}`);
        }
    };

    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // Only process left mouse button
        handleTouchStart(e);

        // Add window listeners for mouse events
        window.addEventListener('mousemove', handleTouchMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = (e) => {
        handleTouchEnd(e);
        window.removeEventListener('mousemove', handleTouchMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        const element = touchRef.current;
        if (!element) return;

        // Touch events
        element.addEventListener('touchstart', handleTouchStart, {passive: false});
        element.addEventListener('touchmove', handleTouchMove, {passive: false});
        element.addEventListener('touchend', handleTouchEnd);

        // Mouse events
        element.addEventListener('mousedown', handleMouseDown);

        return () => {
            if (!element) return;

            // Clean up touch events
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);

            // Clean up mouse events
            element.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);

            // Clear timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {touchRef, isActive};
}
