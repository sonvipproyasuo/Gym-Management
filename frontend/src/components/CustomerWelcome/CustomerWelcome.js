import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Notifications from '../Notifications/Notifications';
import { useNavigate } from 'react-router-dom';

const CustomerWelcome = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);

    const { logout } = useContext(AuthContext);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/notifications/${auth.username}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [auth.username]);

    useEffect(() => {
        if (auth.status === 'inactive') {
            alert('Please change your password for the first login');
        }
        fetchNotifications();
    }, [auth.status, fetchNotifications]);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            await axios.put(`http://localhost:5000/api/customers/${auth.username}/change-password`, {
                newPassword
            });
            alert('Password changed successfully. Please log in again.');
            logout();
            navigate('/');
            
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Failed to change password. Please try again.');
        }
    };    
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="welcome-container">
            <div className="welcome-box">
                <h1>Welcome, {auth.full_name}!</h1>
                <p>This is your customer dashboard.</p>

                {auth.status === 'inactive' && (
                    <div className="change-password-container">
                        <input
                            className='password-change'
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            className='password-change'
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleChangePassword}>Change Password</button>
                        {error && <p className="error-text">{error}</p>}
                    </div>
                )}
            </div>

            <Notifications username={auth.username} token={auth.token} notifications={notifications} />

            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default CustomerWelcome;
