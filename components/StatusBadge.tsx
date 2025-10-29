
import React from 'react';
import { AIStatus } from '../types';

interface StatusBadgeProps {
    status: AIStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const baseClasses = 'text-white py-2 px-4 rounded-md text-sm font-bold inline-block shadow-md';
    
    let colorClasses, animationClasses, shadowClasses;

    switch (status) {
        case AIStatus.ACTIVE:
            colorClasses = 'bg-green-500/80';
            animationClasses = 'animate-pulse';
            shadowClasses = 'shadow-green-500/50';
            break;
        case AIStatus.READY:
            colorClasses = 'bg-cyan-500/80';
            animationClasses = '';
            shadowClasses = 'shadow-cyan-500/50';
            break;
        default:
            colorClasses = 'bg-gray-500/80';
            animationClasses = '';
            shadowClasses = 'shadow-gray-500/50';
    }

    return (
        <span className={`${baseClasses} ${colorClasses} ${animationClasses} ${shadowClasses}`}>
            {status}
        </span>
    );
};
