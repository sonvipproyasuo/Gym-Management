import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = JSON.parse(localStorage.getItem('auth'));
        return storedAuth ? storedAuth : null;
    });

    const login = (token, user) => {
        const authData = { token, username: user.username, role: user.role };
        localStorage.setItem('auth', JSON.stringify(authData));
        setAuth(authData);
    };

    const logout = () => {
        localStorage.removeItem('auth');
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
