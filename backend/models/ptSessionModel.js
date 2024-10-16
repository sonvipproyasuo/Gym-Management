const db = require('../config/db');

const checkExistingSession = async (customer_username, session_date) => {
    const query = `
        SELECT * FROM pt_sessions 
        WHERE customer_username = ? 
        AND session_date = ?
    `;
    const [rows] = await db.execute(query, [customer_username, session_date]);
    return rows.length > 0;
};


const checkTrainerAvailability = async (trainer_username, session_date, start_time) => {
    const query = `
        SELECT * 
        FROM trainer_availability 
        WHERE trainer_username = ? 
        AND available_date = ? 
        AND start_time <= ? 
        AND end_time >= ? 
        AND is_booked = 0
    `;
    const [rows] = await db.execute(query, [trainer_username, session_date, start_time, start_time]);

    return rows.length === 0;
};

const bookSession = async (customer_username, trainer_username, session_date, start_time, pending_action) => {
    const query = `
        INSERT INTO pt_sessions (customer_username, trainer_username, session_date, start_time, status, pending_action)
        VALUES (?, ?, ?, ?, 'pending', ?)
    `;
    await db.execute(query, [customer_username, trainer_username, session_date, start_time, pending_action]);
};

const confirmSession = async (session_id) => {
    const query = `
        UPDATE pt_sessions 
        SET status = 'confirmed' 
        WHERE id = ?
    `;
    await db.execute(query, [session_id]);
};

const isSessionConfirmed = async (session_id) => {
    const query = `
        SELECT * FROM pt_sessions 
        WHERE id = ? 
        AND status = 'confirmed'
    `;
    const [rows] = await db.execute(query, [session_id]);
    return rows.length > 0;
};

const updateSession = async (session_id, new_session_date, new_start_time) => {
    const query = `
        UPDATE pt_sessions 
        SET session_date = ?, start_time = ? 
        WHERE id = ?
    `;
    await db.execute(query, [new_session_date, new_start_time, session_id]);
};

const deleteSession = async (session_id) => {
    const query = `
        DELETE FROM pt_sessions 
        WHERE id = ?
    `;
    await db.execute(query, [session_id]);
};

const getPendingSessions = async (trainer_username) => {
    const query = `
        SELECT pt_sessions.*, customers.full_name AS customer_full_name 
        FROM pt_sessions
        JOIN customers ON pt_sessions.customer_username = customers.username
        WHERE pt_sessions.trainer_username = ? 
        AND pt_sessions.status = 'pending'
    `;
    const [rows] = await db.execute(query, [trainer_username]);

    const updatedRows = rows.map(row => {
        if (row.session_date) {
            const sessionDate = new Date(row.session_date);
            sessionDate.setDate(sessionDate.getDate() + 1);
            row.session_date = sessionDate.toISOString().split('T')[0];
        }
        return row;
    });

    return updatedRows;
};

const getAvailableTrainers = async () => {
    const query = `
        SELECT * FROM trainers
        WHERE specialization = 'trainer'
    `;
    const [rows] = await db.execute(query);
    return rows;
};

const getSessionsByCustomer = async (customer_username) => {
    const query = `
        SELECT pt_sessions.*, trainers.full_name 
        FROM pt_sessions
        JOIN trainers ON pt_sessions.trainer_username = trainers.username
        WHERE pt_sessions.customer_username = ?
    `;
    const [rows] = await db.execute(query, [customer_username]);

    const updatedRows = rows.map(row => {
        if (row.session_date) {
            const sessionDate = new Date(row.session_date);
            sessionDate.setDate(sessionDate.getDate() + 1);
            row.session_date = sessionDate.toISOString().split('T')[0];
        }
        return row;
    });

    return updatedRows;
};

const getConfirmedSessions = async (trainer_username) => {
    const query = `
        SELECT pt_sessions.*, customers.full_name AS customer_full_name 
        FROM pt_sessions
        JOIN customers ON pt_sessions.customer_username = customers.username
        WHERE pt_sessions.trainer_username = ? 
        AND pt_sessions.status = 'confirmed'
    `;
    const [rows] = await db.execute(query, [trainer_username]);

    const updatedRows = rows.map(row => {
        if (row.session_date) {
            const sessionDate = new Date(row.session_date);
            sessionDate.setDate(sessionDate.getDate() + 1);
            row.session_date = sessionDate.toISOString().split('T')[0];
        }
        return row;
    });

    return updatedRows;
};

const getSessionById = async (session_id) => {
    const query = `
        SELECT * FROM pt_sessions 
        WHERE id = ?
    `;
    const [rows] = await db.execute(query, [session_id]);
    return rows[0];
};

const updateSessionStatus = async (session_id, status) => {
    const query = `
        UPDATE pt_sessions 
        SET status = ? 
        WHERE id = ?
    `;
    await db.execute(query, [status, session_id]);
};

const updatePendingAction = async (session_id, pending_action) => {
    const query = `
        UPDATE pt_sessions 
        SET pending_action = ? 
        WHERE id = ?
    `;
    await db.execute(query, [pending_action, session_id]);
};

const setPendingUpdate = async (session_id, new_session_date, new_start_time) => {
    const query = `
        UPDATE pt_sessions 
        SET new_session_date = ?, new_start_time = ?
        WHERE id = ?
    `;
    await db.execute(query, [new_session_date, new_start_time, session_id]);
};

const applyPendingUpdate = async (session_id) => {
    const query = `
        UPDATE pt_sessions 
        SET session_date = new_session_date, start_time = new_start_time,
            new_session_date = NULL, new_start_time = NULL
        WHERE id = ?
    `;
    await db.execute(query, [session_id]);
};

module.exports = {
    checkExistingSession,
    checkTrainerAvailability,
    bookSession,
    confirmSession,
    isSessionConfirmed,
    updateSession,
    deleteSession,
    getPendingSessions,
    getAvailableTrainers,
    getSessionsByCustomer,
    getConfirmedSessions,
    getSessionById,
    updatePendingAction,
    updateSessionStatus,
    setPendingUpdate,
    applyPendingUpdate
};
