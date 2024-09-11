import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { auth, login } = useContext(AuthContext);

    useEffect(() => {
        if (auth) {
            navigate('/welcome');
        }
    }, [auth, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
    
            login(response.data.token);
    
            navigate('/welcome');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Wrong password');
            } else {
                setError('Login unsuccessfully. Please re-check your information');
            }
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>WELCOME TO <br />SHAUN THE GYM</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
