import React from 'react';
import { getStatusColorClass } from '@/Utils/GlobalThemeUtils';

export default function StatusBadge({ status, className = '', ...props }) {
    const colorClass = getStatusColorClass(status, 'badge');

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}
            {...props}
        >
            {status}
        </span>
    );
}
