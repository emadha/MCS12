import React from 'react';
import { cardStyles } from '@/Utils/GlobalThemeUtils';

export default function ThemeCard({ className = '', children, ...props }) {
    return (
        <div className={`${cardStyles.base} ${className}`} {...props}>
            {children}
        </div>
    );
}

ThemeCard.Header = function CardHeader({ className = '', children, ...props }) {
    return (
        <div className={`${cardStyles.header} ${className}`} {...props}>
            {children}
        </div>
    );
};

ThemeCard.Body = function CardBody({ className = '', children, ...props }) {
    return (
        <div className={`${cardStyles.body} ${className}`} {...props}>
            {children}
        </div>
    );
};

ThemeCard.Footer = function CardFooter({ className = '', children, ...props }) {
    return (
        <div className={`${cardStyles.footer} ${className}`} {...props}>
            {children}
        </div>
    );
};
