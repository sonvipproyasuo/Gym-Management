const classRegistrationModel = require('../models/classRegistrationModel');

const registerForClass = async (req, res) => {
    const { class_id, customer_username } = req.body;

    try {
        const result = await classRegistrationModel.registerForClass({ class_id, customer_username });

        return res.status(201).json({
            message: 'Customer registered for class successfully',
            registration: {
                id: result.insertId,
                class_id,
                customer_username
            }
        });
    } catch (err) {
        console.error('Error registering for class:', err);
        return res.status(500).json({ message: 'Error registering for class' });
    }
};

module.exports = {
    registerForClass
};
