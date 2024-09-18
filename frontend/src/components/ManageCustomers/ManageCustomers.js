import React, { useState, useEffect } from 'react';
import CreateCustomer from './CreateCustomer';
import './ManageCustomers.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageCustomers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
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
            if (selectedCustomer) {
                await axios.put(`http://localhost:5000/api/customers/${selectedCustomer.username}`, customerData);
                
                const updatedCustomers = customers.map(customer => 
                    customer.username === selectedCustomer.username 
                        ? { ...customer, ...customerData, full_name: customerData.fullName } 
                        : customer
                );
                setCustomers(updatedCustomers);
                
                alert('Customer updated successfully');
            } else {
                const response = await axios.post('http://localhost:5000/api/customers', customerData);
    
                setCustomers([...customers, {
                    ...response.data.newCustomer,
                    full_name: response.data.newCustomer.full_name,
                    status: response.data.newCustomer.status || 'inactive'
                }]);
    
                alert('Customer created successfully');
            }
    
            setIsModalOpen(false);
            setSelectedCustomer(null);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                const duplicateFields = error.response.data.existingFields;
                const errorMessages = [];
                if (duplicateFields.username) errorMessages.push('Username already exists');
                if (duplicateFields.email) errorMessages.push('Email already exists');
                if (duplicateFields.phone) errorMessages.push('Phone number already exists');
                setErrorMessage(errorMessages.join(', '));
            } else {
                setErrorMessage('Failed to create/update customer');
            }
        }
    };
    
    const handleUpdateCustomer = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const deleteCustomer = async (username) => {
        const confirmed = window.confirm('Are you sure you want to delete this customer? This action cannot be undone.');
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:5000/api/customers/${username}`);
            setCustomers(customers.filter(customer => customer.username !== username));
            alert('Customer and corresponding account deleted successfully!');
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Failed to delete customer. Please try again.');
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
                                        <td>{customer.full_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.status}</td>
                                        <td>
                                            <button onClick={() => handleUpdateCustomer(customer)}>
                                                Update
                                            </button>
                                            <button onClick={() => deleteCustomer(customer.username)}>
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
                    onClose={() => { setIsModalOpen(false); setSelectedCustomer(null); }} 
                    onSubmit={handleCreateCustomer} 
                    errorMessage={errorMessage}
                    customer={selectedCustomer}
                />
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
};

export default ManageCustomers;
