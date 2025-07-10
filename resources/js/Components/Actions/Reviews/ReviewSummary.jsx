import React from 'react';
import StarRating from './StarRating';
import {motion} from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
};

const ReviewSummary = ({averageRating, totalReviews, ratingDistribution = {}}) => {
    // Calculate percentages for the rating bars
    const calculatePercentage = (count) => {
        return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    };

    return (
        <motion.div
            className={'p-4 rounded-lg'}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex flex-col sm:flex-srow gap-6">
                <motion.div className="flex flex-col items-center justify-center" variants={itemVariants}>
                    {averageRating && (
                        <motion.span
                            className="text-3xl font-bold mb-1"
                            variants={itemVariants}
                        >
                            {averageRating.toFixed(1)}
                        </motion.span>
                    )}
                    <motion.div className="mb-1" variants={itemVariants}>
                        <StarRating rating={averageRating} size="lg"/>
                    </motion.div>
                    <motion.span
                        className="text-sm text-gray-500 dark:text-gray-400"
                        variants={itemVariants}
                    >
                        {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </motion.span>
                </motion.div>

                                    <motion.div className="flex-grow" variants={itemVariants}>
                    <motion.div className="space-y-2" variants={itemVariants}>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = ratingDistribution[star] || 0;
                            const percentage = calculatePercentage(count);

                            return (
                                <motion.div
                                    key={star}
                                    className="flex items-center"
                                    variants={itemVariants}
                                >
                                    <motion.div
                                        className="w-8 text-sm whitespace-nowrap select-none pr-14 rtl:pr-0 rtl:pl-14 text-gray-600 dark:text-gray-400"
                                        variants={itemVariants}
                                    >
                                        {star} star
                                    </motion.div>
                                    <motion.div
                                        className="flex-grow mx-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden"
                                        variants={itemVariants}
                                    >
                                        <motion.div
                                            initial={{width: 0}}
                                            animate={{width: `${percentage}%`}}
                                            transition={{duration: 0.8, delay: 0.2 * (6 - star)}}
                                            className="h-full bg-yellow-500 rounded-full"
                                        />
                                    </motion.div>
                                    <motion.div
                                        className="w-8 text-xs text-gray-500 dark:text-gray-400 text-right"
                                        variants={itemVariants}
                                    >
                                        {count}
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ReviewSummary;
