const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/', trainerController.createTrainer);
router.put('/:username', trainerController.updateTrainer);
router.get('/', trainerController.getTrainers);
router.delete('/:username', trainerController.deleteTrainer);

module.exports = router;
