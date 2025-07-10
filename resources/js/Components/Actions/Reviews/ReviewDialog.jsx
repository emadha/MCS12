import React from 'react';
import HeadlessDialog from '@/Components/HeadlessDialog';
import StarRating from './StarRating';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle, faTimes} from '@fortawesome/free-solid-svg-icons';

const ReviewDialog = ({isOpen, onClose, review}) => {
    if (!review) return null;

    const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <HeadlessDialog open={isOpen} onClose={onClose}>
            <div className="min-w-[300px] sm:min-w-[300px] max-w-2xl">
                <div className="flex justify-between items-start mb-4">
                    <HeadlessDialog.Title className="text-xl font-medium">
                        Review Details
                    </HeadlessDialog.Title>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <div className="font-medium">{review.user?.name || 'Anonymous'}</div>
                            {review.is_verified && (
                                <span className="text-green-600 dark:text-green-400" title="Verified Purchase">
                                    <FontAwesomeIcon icon={faCheckCircle}/>
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</div>
                    </div>

                    <div className="mb-3">
                        <StarRating rating={review.rating} size="lg"/>
                    </div>
                </div>

                {review.title && (
                    <h3 className="text-lg font-black mb-2">{review.title}</h3>
                )}

                <div className="text-gray-700 dark:text-gray-300 mb-6 max-h-[300px] overflow-y-auto">
                    {review.content}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </HeadlessDialog>
    );
};

export default ReviewDialog;
