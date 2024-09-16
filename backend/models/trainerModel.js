const db = require('../config/db');

const createTrainer = async (trainerData) => {
    const { username, full_name, email, phone, specialization } = trainerData;
    const [result] = await db.query(
        `INSERT INTO trainers (username, full_name, email, phone, specialization)
         VALUES (?, ?, ?, ?, ?)`,
        [username, full_name, email, phone, specialization]
    );
    return result;
};

const updateTrainerByUsername = async (username, updatedTrainer) => {
    const { full_name, email, phone, specialization } = updatedTrainer;
    const query = `
        UPDATE trainers
        SET full_name = ?, email = ?, phone = ?, specialization = ?
        WHERE username = ?
    `;
    const values = [full_name, email, phone, specialization, username];
    return db.query(query, values);
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

module.exports = {
    createTrainer,
    updateTrainerByUsername,
    getTrainerByUsername,
    getAllTrainers,
    deleteTrainerByUsername
};
