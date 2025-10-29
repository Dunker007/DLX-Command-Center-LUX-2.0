
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-cyan-900/30 border border-cyan-500/30 p-6 rounded-xl shadow-lg shadow-cyan-500/10 transition-all duration-300 ease-in-out hover:shadow-cyan-400/20 hover:border-cyan-400/50 ${className}`}>
            {children}
        </div>
    );
};
