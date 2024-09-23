import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notifications from '../Notifications/Notifications';

const TrainerWelcome = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/notifications/${auth.username}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [auth.username]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="welcome-container">
            <div className="welcome-box">
                <h1>Welcome, {auth.full_name}!</h1>
                <p>This is your trainer dashboard.</p>
            </div>

            <Notifications username={auth.username} token={auth.token} notifications={notifications} />

            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default TrainerWelcome;
