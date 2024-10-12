const classRegistrationModel = require('../models/classRegistrationModel');
const notificationModel = require('../models/notificationModel');
const classModel = require('../models/classModel');
const db = require('../config/db');

const registerForClass = async (req, res) => {
    const { class_id, customer_username } = req.body;

    if (!class_id || !customer_username) {
        return res.status(400).json({ message: 'Missing class_id or customer_username' });
    }

    try {
        await classRegistrationModel.addRegistration(class_id, customer_username);
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        if (error.message === 'Class is full') {
            return res.status(400).json({ message: 'The class is full, registration not allowed' });
        }
        console.error('Error registering for class:', error);
        res.status(500).json({ message: 'Failed to register for class' });
    }
};

const getAvailableClasses = async (req, res) => {
    const { username } = req.params;

    try {
        const availableClasses = await classModel.getAvailableClassesForUser(username);
        res.status(200).json(availableClasses);
    } catch (error) {
        console.error('Error fetching available classes:', error);
        res.status(500).json({ message: 'Failed to fetch available classes' });
    }
};

const getRegisteredClassesForUser = async (req, res) => {
    const { username } = req.params;

    try {
        const query = `
            SELECT classes.*, trainers.full_name
            FROM classes
            JOIN trainers ON classes.instructor_username = trainers.username
            WHERE classes.id IN (
                SELECT class_id FROM class_registrations WHERE customer_username = ?
            )
        `;
        const [rows] = await db.execute(query, [username]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching registered classes:', error);
        res.status(500).json({ message: 'Failed to fetch registered classes' });
    }
};

const unregisterFromClass = async (req, res) => {
    const { class_id, customer_username } = req.body;

    try {
        const alreadyRegistered = await classRegistrationModel.checkIfAlreadyRegistered(class_id, customer_username);
        if (!alreadyRegistered) {
            return res.status(400).json({ message: 'You are not registered for this class' });
        }

        await classRegistrationModel.unregisterFromClass(class_id, customer_username);
        res.status(200).json({ message: 'Unregistration successful' });
    } catch (error) {
        console.error('Error unregistering from class:', error);
        res.status(500).json({ message: 'Failed to unregister from class' });
    }
};

module.exports = {
    registerForClass,
    getRegisteredClassesForUser,
    unregisterFromClass,
    getAvailableClasses
};
