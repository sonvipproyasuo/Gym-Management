import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Welcome from './components/Welcome/Welcome';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ManageTrainers from './components/ManageTrainers/ManageTrainers';
import ManageCustomers from './components/ManageCustomers/ManageCustomers';
import './App.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/welcome" element={
                        <PrivateRoute>
                            <Welcome />
                        </PrivateRoute>
                    } />
                    <Route path="/manage-trainers" element={<ManageTrainers />} />
                    <Route path="/manage-customers" element={<ManageCustomers />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
