const notificationModel = require('../models/notificationModel');

const getNotificationsByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const notifications = await notificationModel.getNotificationsByUsername(username);
        if (!notifications) {
            return res.status(404).json({ message: 'No notifications found for this user' });
        }
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

const markNotificationsAsRead = async (req, res) => {
    const { username } = req.params;

    try {
        await notificationModel.markAllAsRead(username);
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: 'Failed to mark notifications as read' });
    }
};

module.exports = {
    getNotificationsByUsername,
    markNotificationsAsRead
};
