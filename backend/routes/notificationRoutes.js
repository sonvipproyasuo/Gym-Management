const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/:username', notificationController.getNotificationsByUsername);
router.put('/:username/mark-read', notificationController.markNotificationsAsRead);

module.exports = router;
