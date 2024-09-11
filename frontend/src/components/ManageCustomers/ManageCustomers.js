import React, { useState, useEffect } from 'react';
import CreateCustomer from './CreateCustomer';
import './ManageCustomers.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageCustomers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleCreateCustomer = async (customerData) => {
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/customers', customerData);
            
            setCustomers([...customers, response.data.newCustomer]);
            
            setIsModalOpen(false);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                const duplicateFields = error.response.data.existingFields;
                const errorMessages = [];
                if (duplicateFields.username) errorMessages.push('Username already exists');
                if (duplicateFields.email) errorMessages.push('Email already exists');
                if (duplicateFields.phone) errorMessages.push('Phone number already exists');
                setErrorMessage(errorMessages.join(', '));
            } else {
                setErrorMessage('Failed to create customer');
            }
        }
    };

    return (
        <div className="manage-customers-container">
            <div className="manage-customers-content">
                <h1>Manage Customers</h1>
                <button className="create-button" onClick={() => setIsModalOpen(true)}>Add Customer</button>
                <div className="customers-list">
                    {customers.length === 0 ? (
                        <p>No customers available.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.full_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.status}</td>
                                        <td>
                                            <button onClick={() => alert('Redirect to customer details')}>
                                                View Details
                                            </button>
                                            <button onClick={() => alert('Delete customer')}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <CreateCustomer 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleCreateCustomer} 
                    errorMessage={errorMessage}
                />
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
};

export default ManageCustomers;
