import React from 'react';
import StarRating from './StarRating';
import {motion} from 'framer-motion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons';

const ReviewItem = ({review, onClick = null}) => {
    const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            whileHover={{scale: onClick ? 1.01 : 1}}
            whileTap={{scale: onClick ? 0.99 : 1}}
            className={`p-4 border-b border-gray-200 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick ? () => onClick(review) : undefined}
        >
            {review.title && <h4 className="mb-1">{review.title}</h4>}

            <div className={'flex flex-wrap'}>
                <div className="flex items-start w-full justify-between">
                    <div className="w-1/2 whitespace-nowrap flex items-center gap-1">
                        {review.is_verified &&
                            <FontAwesomeIcon className={'text-lime-500 text-xs'} icon={faCheckCircle}/>}
                        <div className="font-medium text-sm">{review.user?.name || 'Anonymous'}</div>
                    </div>
                    <div className={'w-1/2 flex justify-end'}>
                        <StarRating rating={review.rating} size="sm"/>
                    </div>
                </div>
                <div className="text-sm line-clamp-3">
                    {review.content}
                </div>
                <div className="w-1/3 text-xs text-gray-500 dark:text-gray-400">{formattedDate}</div>
            </div>

            <div className="mb-2">
            </div>
        </motion.div>
    );
};

export default ReviewItem;
