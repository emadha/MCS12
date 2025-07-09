import React from 'react';
import StarRating from './StarRating';
import { motion } from 'framer-motion';

const ReviewSummary = ({ averageRating, totalReviews, ratingDistribution = {} }) => {
  // Calculate percentages for the rating bars
  const calculatePercentage = (count) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center justify-center">
          <span className="text-3xl font-bold mb-1">{averageRating.toFixed(1)}</span>
          <div className="mb-1">
            <StarRating rating={averageRating} size="lg" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className="flex-grow">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0;
              const percentage = calculatePercentage(count);

              return (
                <div key={star} className="flex items-center">
                  <div className="w-8 text-sm text-gray-600 dark:text-gray-400">{star} star</div>
                  <div className="flex-grow mx-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * (6 - star) }}
                      className="h-full bg-yellow-500 rounded-full"
                    />
                  </div>
                  <div className="w-8 text-xs text-gray-500 dark:text-gray-400 text-right">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewSummary;
