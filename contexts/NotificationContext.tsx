import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Notification } from '../components/Notification';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
    duration?: number; // Duration in ms, 0 for persistent
}

interface NotificationContextType {
    addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: NotificationType, duration: number = 5000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const dismissNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed top-20 right-4 z-[100] space-y-3 w-full max-w-sm">
                {notifications.map(n => (
                    <Notification key={n.id} notification={n} onDismiss={dismissNotification} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};