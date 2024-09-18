import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TrainerWelcome = () => {
    const { auth, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (auth.status === 'inactive') {
            setSuccessMessage('Please change your password for the first login');
        }
    }, [auth.status]);

    const { logout } = useContext(AuthContext);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/trainers/${auth.username}/change-password`, {
                newPassword
            });

            alert('Password changed successfully');

            const updatedTrainer = {
                ...auth,
                status: 'active'
            };
            login(auth.token, updatedTrainer);
            setSuccessMessage('');
            setError('');
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
                <p>This is your trainer dashboard.</p>
                
                {auth.status === 'inactive' && (
                    <div className="change-password-container">
                        <p>{successMessage}</p>
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
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default TrainerWelcome;
