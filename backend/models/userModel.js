const db = require('../config/db');

const findUserByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

const createUser = async (userData) => {
    const { username, password, email, phone, role } = userData;
    const query = 'INSERT INTO users (username, password, email, phone, role) VALUES (?, ?, ?, ?, ?)';
    const values = [username, password, email, phone, role];
    return db.query(query, values);
};


const deleteUserByUsername = async (username) => {
    return db.query('DELETE FROM users WHERE username = ?', [username]);
};

const checkUserExists = async (username, email, phone) => {
    const [results] = await db.query(
        'SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?',
        [username, email, phone]
    );
    return results;
};

const updateUserPassword = async (username, newPassword) => {
    return db.query('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
};


module.exports = {
    createUser,
    findUserByUsername,
    deleteUserByUsername,
    checkUserExists,
    updateUserPassword
};
