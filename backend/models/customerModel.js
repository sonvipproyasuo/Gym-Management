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

const getCustomerByUsername = async (username) => {
    const [result] = await db.query('SELECT * FROM customers WHERE username = ?', [username]);
    return result[0];
};

const deleteCustomerByUsername = async (username) => {
    return db.query('DELETE FROM customers WHERE username = ?', [username]);
};

const createCustomer = async (customerData) => {
    const { username, full_name, email, phone, address, pt_sessions_registered, avatar } = customerData;
    const [result] = await db.query(
        `INSERT INTO customers (username, full_name, email, phone, address, pt_sessions_registered, avatar, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive')`,
        [username, full_name, email, phone, address, pt_sessions_registered, avatar]
    );
    return result;
};

const updateCustomerByUsername = async (username, updatedCustomer) => {
    const { full_name, address, pt_sessions_registered, avatar } = updatedCustomer;
    return db.query(
        `UPDATE customers 
         SET full_name = ?, address = ?, pt_sessions_registered = ?, avatar = ?
         WHERE username = ?`,
        [full_name, address, pt_sessions_registered, avatar, username]
    );
};


const updateCustomerStatus = async (username, status) => {
    return db.query('UPDATE customers SET status = ? WHERE username = ?', [status, username]);
};


module.exports = {
    getAllCustomers,
    checkCustomerExists,
    createCustomer,
    getCustomerByUsername,
    deleteCustomerByUsername,
    updateCustomerByUsername,
    updateCustomerStatus
};
