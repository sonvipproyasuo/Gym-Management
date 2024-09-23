import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Welcome from './components/Welcome/Welcome';
import CustomerWelcome from './components/CustomerWelcome/CustomerWelcome';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ManageTrainers from './components/ManageTrainers/ManageTrainers';
import ManageCustomers from './components/ManageCustomers/ManageCustomers';
import './App.css';
import TrainerWelcome from './components/TrainerWelcome/TrainerWelcome';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    
                    <Route path="/welcome" element={
                        <PrivateRoute requiredRole="super_admin">
                            <Welcome />
                        </PrivateRoute>
                    } />
                    <Route path="/manage-trainers" element={
                        <PrivateRoute requiredRole="super_admin">
                            <ManageTrainers />
                        </PrivateRoute>
                    } />
                    <Route path="/manage-customers" element={
                        <PrivateRoute requiredRole="super_admin">
                            <ManageCustomers />
                        </PrivateRoute>
                    } />


                    <Route path="/customer-welcome" element={
                        <PrivateRoute requiredRole="customer">
                            <CustomerWelcome />
                        </PrivateRoute>
                    } />

                    <Route path="/trainer-welcome" element={
                        <PrivateRoute requiredRole="trainer">
                            <TrainerWelcome />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
