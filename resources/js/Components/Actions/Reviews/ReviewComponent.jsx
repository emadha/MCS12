import React, {useContext, useEffect, useState} from 'react';
import {usePage} from '@inertiajs/react';
import ReviewSummary from './ReviewSummary';
import ReviewList from './ReviewList';
import {motion} from 'framer-motion';
import {AppContext} from "@/AppContext.js";
import Loading from "@/Components/Loading.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import HeadlessDialog from "@/Components/HeadlessDialog.jsx";
import ReviewForm from "@/Components/Actions/Reviews/ReviewForm.jsx";
import PrimaryButton from "@/Components/Form/Buttons/PrimaryButton.jsx";

export default function ReviewComponent({
                                            h,
                                            initialReviews = [],
                                            initialAverage = 0,
                                            maxDisplayedReviews = 3
                                        }) {

    const {api} = useContext(AppContext);
    const {auth} = usePage().props;
    const [reviews, setReviews] = useState(initialReviews);
    const [averageRating, setAverageRating] = useState(initialAverage);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [hasUserReviewed, setHasUserReviewed] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Calculate rating distribution
    const calculateRatingDistribution = () => {
        const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        reviews?.forEach(review => {
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

    useEffect(() => {
        getReviews()
    }, []);


    const getReviews = async () => {
        setIsLoading(true)
        api.get(route('api.reviews.index', {h: h}))
            .then(response => {
                setReviews(response.data.reviews);
                setAverageRating(response.data.average_rating);
            })
            .catch(error => setError('Error fetching reviews'))
            .finally(() => setIsLoading(false));
    }

    const toggleReviewForm = () => {
        setShowReviewForm(!showReviewForm);
    };

    return <motion.div
        initial={{opacity: 0, height: 0}}
        animate={{
            opacity: 1,
            height: "auto"
        }}
        transition={{
            duration: 0.3,
            ease: "easeInOut"
        }}
    >
        {isLoading ? <Loading loadingText={'Loading Reviews...'}/>
            : error
                ? <div className={'flex items-center justify-center py-10 gap-x-2 text-xs select-none'}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={'animate-pulse'}/>
                    <span>{error}</span>
                </div>
                : <div className="space-y-6">
                    <ReviewSummary
                        averageRating={averageRating}
                        totalReviews={reviews?.length}
                        ratingDistribution={calculateRatingDistribution()}
                    />

                    {reviews.length > 0 ? (
                        <div className="mt-6 -mx-3">
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
                                You've already submitted a review.
                            </motion.div>
                        ) : (
                            <div className="mt-6">
                                {showReviewForm ? (
                                    <HeadlessDialog open={showReviewForm} onClose={toggleReviewForm}
                                                    title={'Write a Review'}>

                                        <ReviewForm h={h}/>

                                    </HeadlessDialog>
                                ) : (
                                    <div className="text-center">
                                    </div>
                                )}
                                <PrimaryButton size={'xs'} className={'mx-auto'} onClick={toggleReviewForm}>Write a
                                    Review</PrimaryButton>
                            </div>
                        )
                    ) : (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            className="text-center py-4 text-gray-600 dark:text-gray-400">
                            Please <a href={route('login')} className="text-primary-600 hover:underline">sign in</a> to
                            leave a
                            review.
                        </motion.div>
                    )}
                </div>
        }
    </motion.div>
    }

