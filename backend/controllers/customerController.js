const customerModel = require('../models/customerModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const getCustomers = async (req, res) => {
    try {
        const customers = await customerModel.getAllCustomers();
        return res.status(200).json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
        return res.status(500).json({ message: 'Error fetching customers' });
    }
};

const checkCustomer = async (req, res) => {
    const { username, email, phone } = req.body;

    try {
        const results = await customerModel.checkCustomerExists(username, email, phone);

        if (results.length > 0) {
            const existingFields = {};
            results.forEach(customer => {
                if (customer.username === username) existingFields.username = 'Username';
                if (customer.email === email) existingFields.email = 'Email';
                if (customer.phone === phone) existingFields.phone = 'Phone';
            });
            return res.status(409).json({ message: 'Duplicate information', existingFields });
        }

        return res.status(200).json({ message: 'Customer information is unique' });
    } catch (err) {
        console.error('Error checking customer:', err);
        return res.status(500).json({ message: 'Error checking customer' });
    }
};

const createCustomer = async (req, res) => {
    const { username, fullName, email, phone, address, ptSessionsRegistered } = req.body;
    const avatar = req.file ? req.file.filename : null;

    const customerData = {
        username,
        fullName,
        email,
        phone,
        address,
        ptSessionsRegistered,
        avatar
    };

    try {
        const existingCustomer = await customerModel.checkCustomerExists(username, email, phone);

        if (existingCustomer.length > 0) {
            const existingFields = {};
            existingCustomer.forEach(customer => {
                if (customer.username === username) existingFields.username = 'Username';
                if (customer.email === email) existingFields.email = 'Email';
                if (customer.phone === phone) existingFields.phone = 'Phone';
            });
            return res.status(409).json({ message: 'Duplicate information', existingFields });
        }

        const result = await customerModel.createCustomer(customerData);
        const newCustomerId = result.insertId;

        const hashedPassword = await bcrypt.hash('1', 10);
        const userData = {
            username,
            password: hashedPassword,
            role: 'customer'
        };
        await userModel.createUser(userData);

        return res.status(201).json({
            message: 'Customer and user account created successfully with default password "1"',
            newCustomer: { id: newCustomerId, ...customerData }
        });
    } catch (err) {
        console.error('Error creating customer:', err);
        return res.status(500).json({ message: 'Error creating customer' });
    }
};

const deleteCustomer = async (req, res) => {
    const { username } = req.params;

    try {
        const customer = await customerModel.getCustomerByUsername(username);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }


        await customerModel.deleteCustomerByUsername(username);

        await userModel.deleteUserByUsername(username);

        res.status(200).json({ message: 'Customer and corresponding account deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Failed to delete customer' });
    }
};

module.exports = {
    getCustomers,
    checkCustomer,
    createCustomer,
    deleteCustomer
};
