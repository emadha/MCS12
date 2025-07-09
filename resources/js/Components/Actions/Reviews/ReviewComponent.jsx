import React, {useEffect, useState} from 'react';
import {usePage} from '@inertiajs/react';
import ReviewSummary from './ReviewSummary';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import {motion} from 'framer-motion';

export default function ReviewComponent({
                                            h,
                                            initialReviews = [],
                                            initialAverage = 0,
                                            maxDisplayedReviews = 3
                                        }) {

    const {auth} = usePage().props;
    const [reviews, setReviews] = useState(initialReviews);
    const [averageRating, setAverageRating] = useState(initialAverage);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [hasUserReviewed, setHasUserReviewed] = useState(false);

    // Calculate rating distribution
    const calculateRatingDistribution = () => {
        const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        reviews.forEach(review => {
            const rating = Math.round(review.rating);
            if (rating >= 1 && rating <= 5) {
                distribution[rating]++;
            }
        });
        return distribution;
    };

    // Check if the authenticated user has already reviewed
    useEffect(() => {
        if (auth?.user) {
            const userHasReviewed = reviews.some(review => review.user_id === auth.user.id);
            setHasUserReviewed(userHasReviewed);
        }
    }, [auth?.user, reviews]);

    // Handle successful review submission
    const handleReviewSuccess = () => {
        // Fetch updated reviews from the server
        fetch(route('api.reviews.index', {
            h: h
        }))
            .then(response => response.json())
            .then(data => {
                setReviews(data.reviews);
                setAverageRating(data.average_rating);
                setShowReviewForm(false);
                setHasUserReviewed(true);
            })
            .catch(error => console.error('Error fetching reviews:', error));
    };

    const toggleReviewForm = () => {
        setShowReviewForm(!showReviewForm);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Customer Reviews</h2>

            <ReviewSummary
                averageRating={averageRating}
                totalReviews={reviews.length}
                ratingDistribution={calculateRatingDistribution()}
            />

            {reviews.length > 0 ? (
                <div className="mt-6">
                    <h3 className="text-xl font-medium mb-4">Reviews</h3>
                    <ReviewList reviews={reviews} maxReviews={maxDisplayedReviews}/>
                </div>
            ) : (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                    No reviews yet. Be the first to review!
                </motion.div>
            )}

            {auth?.user ? (
                hasUserReviewed ? (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="text-center py-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                        You've already submitted a review for this item.
                    </motion.div>
                ) : (
                    <div className="mt-6">
                        {showReviewForm ? (
                            <ReviewForm
                                h={h}
                                onSuccess={handleReviewSuccess}
                            />
                        ) : (
                            <div className="text-center">
                                <button
                                    onClick={toggleReviewForm}
                                    className="px-4 py-2 bg-primary hover:bg-primary-700 text-white rounded-md transition-colors"
                                >
                                    Write a Review
                                </button>
                            </div>
                        )}
                    </div>
                )
            ) : (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="text-center py-4 text-gray-600 dark:text-gray-400">
                    Please <a href={route('login')} className="text-primary-600 hover:underline">sign in</a> to leave a
                    review.
                </motion.div>
            )}
        </div>
    );
};
