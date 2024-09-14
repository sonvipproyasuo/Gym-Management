import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const CustomerWelcome = () => {
    const { auth } = useContext(AuthContext);

    if (!auth) {
        return <p>Loading...</p>;
    }

    return (
        <div className="customer-welcome-container">
            <h1>Welcome, {auth.username}!</h1>
        </div>
    );
};

export default CustomerWelcome;
