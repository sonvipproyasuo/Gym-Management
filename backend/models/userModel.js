const db = require('../config/db');

const findUserByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

const createUser = async (userData) => {
    const { username, password, role } = userData;
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    const values = [username, password, role];
    return db.query(query, values);
};

const deleteUserByUsername = async (username) => {
    return db.query('DELETE FROM users WHERE username = ?', [username]);
};

module.exports = {
    createUser,
    findUserByUsername,
    deleteUserByUsername
};
