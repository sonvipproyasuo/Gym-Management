const db = require('../config/db');

const createTrainer = async (trainerData) => {
    const { username, fullName, email, phone, specialization } = trainerData;
    const [result] = await db.query(
        `INSERT INTO trainers (username, full_name, email, phone, specialization, status)
         VALUES (?, ?, ?, ?, ?, 'inactive')`,
        [username, fullName, email, phone, specialization]
    );
    return result;
};

const updateTrainerByUsername = async (username, updatedTrainer) => {
    const { full_name } = updatedTrainer;
    await db.query(
        'UPDATE trainers SET full_name = ? WHERE username = ?',
        [full_name, username]
    );
};

const getTrainerByUsername = async (username) => {
    const [result] = await db.query('SELECT * FROM trainers WHERE username = ?', [username]);
    return result[0];
};

const getAllTrainers = async () => {
    const [results] = await db.query('SELECT * FROM trainers');
    return results;
};

const deleteTrainerByUsername = async (username) => {
    return db.query('DELETE FROM trainers WHERE username = ?', [username]);
};

const updatePassword = async (username, hashedPassword) => {
    const query = 'UPDATE users SET password = ? WHERE username = ?';
    return db.query(query, [hashedPassword, username]);
};

const updateStatus = async (username, status) => {
    const query = 'UPDATE trainers SET status = ? WHERE username = ?';
    return db.query(query, [status, username]);
};


module.exports = {
    createTrainer,
    updateTrainerByUsername,
    getTrainerByUsername,
    getAllTrainers,
    deleteTrainerByUsername,
    updatePassword,
    updateStatus
};
