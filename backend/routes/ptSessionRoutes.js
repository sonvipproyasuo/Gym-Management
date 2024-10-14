const express = require('express');
const router = express.Router();
const ptSessionController = require('../controllers/ptSessionController');

router.post('/pt-sessions/book', ptSessionController.bookPTSession);

router.put('/pt-sessions/update', ptSessionController.updatePTSession);

router.delete('/pt-sessions/delete', ptSessionController.deletePTSession);

router.get('/pt-sessions/pending/:trainer_username', ptSessionController.getTrainerPendingSessions);

router.get('/pt-sessions/:customer_username', ptSessionController.getPTSessionsForCustomer);

router.get('/pt-sessions/confirmed/:trainer_username', ptSessionController.getConfirmedPTSessions);

router.put('/pt-sessions/confirm', ptSessionController.confirmPTSession);

router.put('/pt-sessions/cancel', ptSessionController.cancelPTSession);

module.exports = router;
