import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { auth } = useContext(AuthContext);

    if (!auth) {
        return <Navigate to="/" />;
    }

    if (requiredRole && auth.role !== requiredRole) {
        if (auth.role === 'customer') {
            return <Navigate to="/customer-welcome" />;
        }
        if (auth.role === 'trainer') {
            return <Navigate to="/trainer-welcome" />;
        }
        if (auth.role === 'super_admin') {
            return <Navigate to="/welcome" />;
        }
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
