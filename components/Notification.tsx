import React, { useEffect, useState } from 'react';
import { Notification as NotificationType } from '../contexts/NotificationContext';

interface NotificationProps {
    notification: NotificationType;
    onDismiss: (id: number) => void;
}

const typeClasses = {
    success: 'bg-green-600/80 border-green-400',
    error: 'bg-red-600/80 border-red-400',
    info: 'bg-blue-600/80 border-blue-400',
};

export const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
    const { id, message, type, duration } = notification;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Enter animation
        setVisible(true);

        // Auto-dismiss logic
        if (duration && duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => onDismiss(id), 300); // Wait for fade out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onDismiss]);
    
    const handleDismiss = () => {
        setVisible(false);
        setTimeout(() => onDismiss(id), 300);
    }

    const baseClasses = 'text-white p-4 rounded-lg shadow-2xl shadow-black/50 border-l-4 backdrop-blur-md transition-all duration-300 ease-in-out';
    const visibilityClasses = visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full';
    
    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}>
            <div className="flex items-start justify-between">
                <p className="mr-4">{message}</p>
                <button onClick={handleDismiss} className="text-xl font-bold leading-none">&times;</button>
            </div>
        </div>
    );
};