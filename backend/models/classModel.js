const db = require('../config/db');

const createClass = async (classData) => {
    const { title, description, time, duration, max_participants, instructor_username } = classData;
    const [result] = await db.query(
        `INSERT INTO classes (title, description, time, duration, max_participants, instructor_username)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, time, duration, max_participants, instructor_username]
    );
    return result;
};

const getClassesByInstructor = async (instructor_username) => {
    const query = `
        SELECT * FROM classes 
        WHERE instructor_username = ?
    `;
    const [rows] = await db.execute(query, [instructor_username]);
    return rows;
};

const getClassesByTime = async (instructor_username, time, duration) => {
    const query = `
        SELECT * FROM classes 
        WHERE instructor_username = ? 
        AND (
            (time <= ? AND DATE_ADD(time, INTERVAL duration MINUTE) > ?)
            OR (time >= ? AND time < DATE_ADD(?, INTERVAL ? MINUTE))
        )
    `;
    const [rows] = await db.execute(query, [instructor_username, time, time, time, time, duration]);
    return rows;
};

const getClassById = async (id) => {
    const query = 'SELECT * FROM classes WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

const updateClass = async (class_id, { title, description, time, maxParticipants, duration }) => {
    const query = `
        UPDATE classes 
        SET title = ?, description = ?, time = ?, max_participants = ?, duration = ? 
        WHERE id = ?
    `;
    await db.execute(query, [title, description, time, maxParticipants, duration, class_id]);
};

const deleteClassById = async (id) => {
    const query = 'DELETE FROM classes WHERE id = ?';
    await db.execute(query, [id]);
};

const getAvailableClasses = async (currentTime) => {
    const query = `
        SELECT classes.*, trainers.full_name 
        FROM classes 
        JOIN trainers ON classes.instructor_username = trainers.username 
        WHERE classes.time > ?
    `;
    const [rows] = await db.execute(query, [currentTime]);
    return rows;
};

const getAvailableClassesForUser = async (username) => {
    const currentTime = new Date();

    const query = `
        SELECT 
            classes.*, 
            trainers.full_name,
            (classes.max_participants - COUNT(class_registrations.customer_username)) AS available_slots
        FROM classes 
        LEFT JOIN class_registrations ON classes.id = class_registrations.class_id
        JOIN trainers ON classes.instructor_username = trainers.username
        WHERE classes.time > ?  
        AND classes.id NOT IN (
            SELECT class_id 
            FROM class_registrations 
            WHERE customer_username = ?
        )
        GROUP BY classes.id
    `;

    const [availableClasses] = await db.execute(query, [currentTime, username]);
    return availableClasses;
};

const checkIfClassExists = async (classId) => {
    const query = 'SELECT COUNT(*) as count FROM classes WHERE id = ?';
    const [rows] = await db.execute(query, [classId]);
    return rows[0].count > 0;
};

module.exports = {
    createClass,
    getClassesByInstructor,
    getClassesByTime,
    updateClass,
    deleteClassById,
    getClassById,
    getAvailableClasses,
    getAvailableClassesForUser,
    checkIfClassExists
};
