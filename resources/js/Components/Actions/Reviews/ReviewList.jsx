import React, { useState } from 'react';
import ReviewItem from './ReviewItem';
import ReviewDialog from './ReviewDialog';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewList = ({ reviews, maxReviews = 3 }) => {
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
    <div className="space-y-1">
      <AnimatePresence>
        {displayedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ReviewItem review={review} onClick={handleReviewClick} />
          </motion.div>
        ))}
      </AnimatePresence>

      {reviews.length > maxReviews && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center pt-2"
        >
          <button
            onClick={toggleShowAll}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            {showAll ? 'Show Less' : `Show All (${reviews.length})`}
          </button>
        </motion.div>
      )}

      <ReviewDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        review={selectedReview}
      />
    </div>
  );
};

export default ReviewList;
