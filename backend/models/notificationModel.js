const db = require('../config/db');

const createNotification = async (notificationData) => {
    const { username, message } = notificationData;
    await db.query(
        'INSERT INTO notifications (username, message) VALUES (?, ?)',
        [username, message]
    );
};

const getNotificationsByUsername = async (username) => {
    const [results] = await db.query(
        'SELECT * FROM notifications WHERE username = ? ORDER BY created_at DESC',
        [username]
    );
    return results;
};

const markAllAsRead = async (username) => {
    const query = 'UPDATE notifications SET is_read = true WHERE username = ?';
    await db.query(query, [username]);
};

module.exports = {
    createNotification,
    getNotificationsByUsername,
    markAllAsRead
};
