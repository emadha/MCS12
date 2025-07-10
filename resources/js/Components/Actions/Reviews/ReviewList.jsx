import React, {useState} from 'react';
import ReviewItem from './ReviewItem';
import ReviewDialog from './ReviewDialog';
import {AnimatePresence, motion} from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      type: "tween",
      ease: "easeInOut",
      duration: 0.3
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

const ReviewList = ({reviews, maxReviews = 3}) => {
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const displayedReviews = showAll ? reviews : reviews.slice(0, maxReviews);

    const handleReviewClick = (review) => {
        setSelectedReview(review);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <motion.div
            className="space-y-1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            <AnimatePresence mode="wait">
                {displayedReviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        custom={index}
                        variants={itemVariants}
                        layout
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            transition: { duration: 0.2 }
                        }}
                        className="rounded-lg overflow-hidden"
                    >
                        <ReviewItem review={review} onClick={handleReviewClick}/>
                    </motion.div>
                ))}
            </AnimatePresence>

            {reviews.length > maxReviews && (
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center pt-4"
                    layout
                >
                    <motion.button
                        onClick={toggleShowAll}
                        className="text-sm px-4 py-2 rounded-full bg-primary-50 text-primary-600 hover:text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        layout
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={showAll ? 'less' : 'more'}
                        >
                            {showAll ? 'Show Less' : `Show All (${reviews.length})`}
                        </motion.span>
                    </motion.button>
                </motion.div>
            )}

            <AnimatePresence>
                {isDialogOpen && (
                    <ReviewDialog
                        isOpen={isDialogOpen}
                        onClose={closeDialog}
                        review={selectedReview}
                    />
                )}
            </AnimatePresence>

            {reviews.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                    <motion.p
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                            delay: 0.5
                        }}
                    >
                        No reviews yet. Be the first to leave one!
                    </motion.p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ReviewList;
