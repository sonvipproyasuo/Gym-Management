import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Trainer = () => {
    const { auth } = useContext(AuthContext);

    return (
        <div className="welcome-container">
            <div className="welcome-box">
                <h1>Welcome, {auth.full_name}!</h1> {/* Hiển thị full_name từ auth */}
                <p>This is your customer dashboard.</p>
            </div>
        </div>
    );
};

export default Trainer;
