import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user, loading, getToken } = useAuth();
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        if (!user) {
            setNotifications([]);
            return;
        }
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchNotifications();
        }
    }, [user, loading]);

    const markAllAsRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

        try {
            const token = await getToken();
            await fetch(`${API_URL}/api/notifications/read`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error marking as read:", error);
            fetchNotifications(); // revert
        }
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, refreshNotifications: fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
