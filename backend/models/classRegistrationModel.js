const db = require('../config/db');
const getClassById = async (class_id) => {
    const query = 'SELECT * FROM classes WHERE id = ?';
    const [rows] = await db.execute(query, [class_id]);
    return rows[0];
};

const getRegistrationCount = async (class_id) => {
    const query = 'SELECT COUNT(*) as count FROM class_registrations WHERE class_id = ?';
    const [rows] = await db.execute(query, [class_id]);
    return rows[0].count;
};

const addRegistration = async (class_id, customer_username) => {
    const classDataQuery = 'SELECT max_participants FROM classes WHERE id = ?';
    const [classData] = await db.execute(classDataQuery, [class_id]);
    
    if (classData.length === 0) {
        throw new Error('Class not found');
    }

    const maxParticipants = classData[0].max_participants;

    const currentCount = await getRegistrationCount(class_id);

    if (currentCount >= maxParticipants) {
        throw new Error('Class is full');
    }

    const query = `
        INSERT INTO class_registrations (class_id, customer_username, registration_date)
        VALUES (?, ?, NOW())
    `;
    await db.execute(query, [class_id, customer_username]);
};

const checkIfAlreadyRegistered = async (class_id, customer_username) => {
    const query = `
        SELECT * FROM class_registrations
        WHERE class_id = ? AND customer_username = ?
    `;
    const [rows] = await db.execute(query, [class_id, customer_username]);
    return rows.length > 0;
};

const unregisterFromClass = async (class_id, customer_username) => {
    const query = `DELETE FROM class_registrations WHERE class_id = ? AND customer_username = ?`;
    await db.execute(query, [class_id, customer_username]);
};

const getAvailableClassesForUser = async (username) => {
    const currentTime = new Date();

    const query = `
        SELECT classes.*, trainers.full_name
        FROM classes 
        JOIN trainers ON classes.instructor_username = trainers.username
        WHERE classes.time > ?  -- Lấy các lớp chưa diễn ra
        AND classes.id NOT IN (
            SELECT class_id FROM class_registrations 
            WHERE customer_username = ?
        );  -- Loại bỏ các lớp đã đăng ký
    `;

    console.log('Executing query to fetch available classes for:', username);

    try {
        const [availableClasses] = await db.execute(query, [currentTime, username]);
        console.log('Available classes:', availableClasses);
        return availableClasses;
    } catch (error) {
        console.error('Error fetching available classes:', error);
        throw error;
    }
};

const getParticipantsByClassId = async (classId) => {
    const query = `
        SELECT customers.full_name
        FROM class_registrations
        JOIN customers ON class_registrations.customer_username = customers.username
        WHERE class_registrations.class_id = ?
    `;
    const [rows] = await db.execute(query, [classId]);
    return rows.map(row => row.full_name);
};

const checkIfUserHasClassAtSameTime = async (customer_username, class_time, class_duration) => {
    const query = `
        SELECT COUNT(*) as count
        FROM class_registrations 
        JOIN classes ON class_registrations.class_id = classes.id
        WHERE class_registrations.customer_username = ?
        AND (
            (classes.time <= ? AND ADDTIME(classes.time, SEC_TO_TIME(classes.duration * 60)) > ?)
        )
    `;

    const [rows] = await db.execute(query, [customer_username, class_time, class_time]);
    return rows[0].count > 0;
};

const getCustomerByUsername = async (username) => {
    const query = 'SELECT full_name FROM customers WHERE username = ?';
    const [rows] = await db.execute(query, [username]);
    return rows[0];
};

module.exports = {
    getClassById,
    getRegistrationCount,
    addRegistration,
    checkIfAlreadyRegistered,
    unregisterFromClass,
    getAvailableClassesForUser,
    getParticipantsByClassId,
    checkIfUserHasClassAtSameTime,
    getCustomerByUsername
};

