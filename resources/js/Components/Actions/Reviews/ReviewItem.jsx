import React from 'react';
import StarRating from './StarRating';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ReviewItem = ({ review, onClick = null }) => {
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick ? 1.01 : 1 }}
      whileTap={{ scale: onClick ? 0.99 : 1 }}
      className={`p-4 border-b border-gray-200 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? () => onClick(review) : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2">
          <div className="font-medium text-sm">{review.user?.name || 'Anonymous'}</div>
          {review.is_verified && (
            <span className="text-green-600 dark:text-green-400" title="Verified Purchase">
              <FontAwesomeIcon icon={faCheckCircle} />
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</div>
      </div>

      <div className="mb-2">
        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}

      <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
        {review.content}
      </div>
    </motion.div>
  );
};

export default ReviewItem;
