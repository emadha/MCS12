import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

const StarRating = ({ rating, max = 5, onChange, interactive = false, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={index < Math.floor(rating) ? faStarSolid : faStarRegular}
          className={`${sizeClasses[size]} ${index < rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
          onClick={() => handleClick(index + 1)}
        />
      ))}
      {rating % 1 !== 0 && rating % 1 >= 0.5 && (
        <div className="relative inline-block">
          <FontAwesomeIcon
            icon={faStarRegular}
            className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600 absolute left-0`}
          />
          <div className="overflow-hidden absolute left-0" style={{ width: `${(rating % 1) * 100}%` }}>
            <FontAwesomeIcon
              icon={faStarSolid}
              className={`${sizeClasses[size]} text-yellow-500`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StarRating;
