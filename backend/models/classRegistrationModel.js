const db = require('../config/db');

const registerForClass = async (registrationData) => {
    const { class_id, customer_username } = registrationData;
    const [result] = await db.query(
        `INSERT INTO class_registrations (class_id, customer_username) VALUES (?, ?)`,
        [class_id, customer_username]
    );
    return result;
};

const getRegistrationsForClass = async (class_id) => {
    const [result] = await db.query(`SELECT * FROM class_registrations WHERE class_id = ?`, [class_id]);
    return result;
};

module.exports = {
    registerForClass,
    getRegistrationsForClass
};
