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
        const classData = await classRegistrationModel.getClassById(class_id);
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const alreadyRegistered = await classRegistrationModel.checkIfAlreadyRegistered(class_id, customer_username);
        if (alreadyRegistered) {
            return res.status(400).json({ message: 'You have already registered for this class' });
        }

        await classRegistrationModel.addRegistration(class_id, customer_username);

        const customerData = await classRegistrationModel.getCustomerByUsername(customer_username);
        if (!customerData) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await notificationModel.createNotification({
            username: customer_username,
            message: `You have successfully registered for the class: ${classData.title} at ${new Date(classData.time).toLocaleString()}.`
        });

        await notificationModel.createNotification({
            username: classData.instructor_username,
            message: `Customer (${customerData.full_name}) has registered for your class: ${classData.title} at ${new Date(classData.time).toLocaleString()}.`
        });

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
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

        const classData = await classRegistrationModel.getClassById(class_id);

        const customerData = await classRegistrationModel.getCustomerByUsername(customer_username);
        if (!customerData) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await classRegistrationModel.unregisterFromClass(class_id, customer_username);

        await notificationModel.createNotification({
            username: customer_username,
            message: `You have successfully unregistered from the class: ${classData.title} at ${new Date(classData.time).toLocaleString()}.`
        });
        
        await notificationModel.createNotification({
            username: classData.instructor_username,
            message: `Customer (${customerData.full_name}) has unregistered from your class: ${classData.title} at ${new Date(classData.time).toLocaleString()}.`
        });

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
