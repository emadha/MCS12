import React from 'react';
import {motion} from 'framer-motion';

const Card = ({
                  children,
                  className = '',
                  header,
                  footer,
                  animate = true
              }) => {
    const CardWrapper = animate ? motion.div : 'div';

    return (
        <CardWrapper
            initial={animate ? {opacity: 0, y: 20} : undefined}
            animate={animate ? {opacity: 1, y: 0} : undefined}
            transition={{duration: 0.3}}
            className={`shadow-xl border-border border bg-card rounded-lg shadow-sm ${className}`}
        >
            {header && (
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    {header}
                </div>
            )}

            <div className="p-4">
                {children}
            </div>

            {footer && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                    {footer}
                </div>
            )}
        </CardWrapper>
    );
};

export default Card;
