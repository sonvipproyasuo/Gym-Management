import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import { AuthContext } from '../../context/AuthContext';

const Welcome = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleManageTrainers = () => {
        navigate('/manage-trainers');
    };

    const handleManageCustomers = () => {
        navigate('/manage-customers');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="welcome-container">
            <div className="welcome-box">
                <h1>Welcome, Super Admin!</h1>
                <div className="button-group">
                    <button onClick={handleManageTrainers}>Manage Trainers</button>
                    <button onClick={handleManageCustomers}>Manage Customers</button>
                </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Welcome;
