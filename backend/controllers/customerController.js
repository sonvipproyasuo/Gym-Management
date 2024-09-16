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
    const { username, fullName, email, phone, address, pt_sessions_registered } = req.body;
    const avatar = req.file ? req.file.filename : null;

    const customerData = {
        username,
        full_name: fullName,
        email,
        phone,
        address,
        pt_sessions_registered,
        avatar,
        status: 'inactive'
    };

    try {
        // Kiểm tra trùng lặp trong bảng users
        const existingUser = await userModel.checkUserExists(username, email, phone);
        if (existingUser.length > 0) {
            const existingFields = {};
            existingUser.forEach(user => {
                if (user.username === username) existingFields.username = 'Username';
                if (user.email === email) existingFields.email = 'Email';
                if (user.phone === phone) existingFields.phone = 'Phone';
            });
            return res.status(409).json({ message: 'Duplicate information in users', existingFields });
        }

        // Tạo khách hàng mới trong bảng customers
        const result = await customerModel.createCustomer(customerData);
        const newCustomerId = result.insertId;

        // Tạo user mới trong bảng users
        const hashedPassword = await bcrypt.hash('1', 10);
        const userData = {
            username,
            password: hashedPassword,
            email,
            phone,
            role: 'customer'
        };
        await userModel.createUser(userData);

        return res.status(201).json({
            message: 'Customer created successfully',
            newCustomer: {
                id: newCustomerId,
                username,
                full_name: fullName,
                email,
                phone,
                address,
                pt_sessions_registered,
                avatar
            }
        });
    } catch (err) {
        console.error('Error creating customer:', err);
        return res.status(500).json({ message: 'Error creating customer' });
    }
};

const updateCustomer = async (req, res) => {
    const { username } = req.params;
    const { fullName, address, ptSessionsRegistered } = req.body;
    const avatar = req.file ? req.file.filename : null;

    try {
        const customer = await customerModel.getCustomerByUsername(username);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const updatedCustomer = {
            fullName,
            address,
            pt_sessions_registered: ptSessionsRegistered,
            avatar: avatar || customer.avatar
        };

        await customerModel.updateCustomerByUsername(username, updatedCustomer);

        return res.status(200).json({ message: 'Customer updated successfully' });
    } catch (err) {
        console.error('Error updating customer:', err);
        return res.status(500).json({ message: 'Error updating customer' });
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
    updateCustomer,
    deleteCustomer
};
