import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = ({ username, token, notifications }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const unread = notifications.filter(notification => !notification.is_read).length;
        setUnreadCount(unread);
    }, [notifications]);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (unreadCount > 0) {
            markAllAsRead();
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${username}/mark-read`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    return (
        <div className="notification-container">
            <button className="notification-button" onClick={handleToggleDropdown}>
                <i className="bell-icon">🔔</i>
                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
            </button>

            {isDropdownOpen && (
                <div className="notification-dropdown">
                    {notifications.length === 0 ? (
                        <p>No notifications</p>
                    ) : (
                        notifications.map(notification => (
                            <div key={notification.id} className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}>
                                <p>{notification.message}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
