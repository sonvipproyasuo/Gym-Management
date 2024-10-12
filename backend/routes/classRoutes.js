const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const classRegistrationController = require('../controllers/classRegistrationController');

router.post('/classes', classController.createClass);
router.get('/classes/:username', classController.getClassesByInstructor);
router.get('/classes/:id/participants', classController.getClassParticipants);
router.put('/classes/:id', classController.updateClass);
router.delete('/classes/:id', classController.deleteClass);

router.post('/class-registrations', classRegistrationController.registerForClass);

module.exports = router;
