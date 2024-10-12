const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const classRegistrationController = require('../controllers/classRegistrationController');

router.post('/classes', classController.createClass);
router.get('/classes/:username', classController.getClassesByInstructor);
router.get('/classes/:id/participants', classController.getClassParticipants);
router.get('/class-schedule/available', classController.getAvailableClasses);
router.put('/classes/:id', classController.updateClass);
router.delete('/classes/:id', classController.deleteClass);
router.post('/class-schedule/register', classRegistrationController.registerForClass);
router.get('/class-schedule/available/:username', classRegistrationController.getAvailableClasses);
router.get('/class-schedule/registered/:username', classRegistrationController.getRegisteredClassesForUser);
router.delete('/class-schedule/unregister', classRegistrationController.unregisterFromClass);


module.exports = router;
