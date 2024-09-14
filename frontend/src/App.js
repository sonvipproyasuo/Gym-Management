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

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/welcome" element={ 
                        <PrivateRoute role="admin">
                            <Welcome />
                        </PrivateRoute>
                    } />
                    <Route path="/customer-welcome" element={
                        <PrivateRoute role="customer">
                            <CustomerWelcome />
                        </PrivateRoute>
                    } />
                    <Route path="/manage-trainers" element={
                        <PrivateRoute role="admin">
                            <ManageTrainers />
                        </PrivateRoute>
                    } />
                    <Route path="/manage-customers" element={
                        <PrivateRoute role="admin">
                            <ManageCustomers />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
