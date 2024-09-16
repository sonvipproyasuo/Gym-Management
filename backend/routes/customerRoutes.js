const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const upload = require('../middlewares/upload');

router.post('/', upload.single('avatar'), customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.post('/check-customer', customerController.checkCustomer);
router.delete('/:username', customerController.deleteCustomer);
router.put('/:username', upload.single('avatar'), customerController.updateCustomer);

module.exports = router;
