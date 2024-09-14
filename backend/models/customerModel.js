const db = require('../config/db');

const getAllCustomers = async () => {
    const [results] = await db.query('SELECT * FROM customers');
    return results;
};

const checkCustomerExists = async (username, email, phone) => {
    const [results] = await db.query(
        'SELECT * FROM customers WHERE username = ? OR email = ? OR phone = ?',
        [username, email, phone]
    );
    return results;
};

const createCustomer = async (customerData) => {
    const { username, fullName, email, phone, address, ptSessionsRegistered, avatar } = customerData;
    const [result] = await db.query(
        `INSERT INTO customers (username, full_name, email, phone, address, pt_sessions_registered, avatar, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive')`,
        [username, fullName, email, phone, address, ptSessionsRegistered, avatar]
    );
    return result;
};

const getCustomerByUsername = async (username) => {
    const [result] = await db.query('SELECT * FROM customers WHERE username = ?', [username]);
    return result[0];
};

const deleteCustomerByUsername = async (username) => {
    return db.query('DELETE FROM customers WHERE username = ?', [username]);
};

module.exports = {
    getAllCustomers,
    checkCustomerExists,
    createCustomer,
    getCustomerByUsername,
    deleteCustomerByUsername
};
