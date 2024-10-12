const classModel = require('../models/classModel');
const notificationModel = require('../models/notificationModel');
const classRegistrationModel = require('../models/classRegistrationModel');

const createClass = async (req, res) => {
    const { title, description, time, maxParticipants, duration, instructor_username } = req.body;

    try {
        const existingClasses = await classModel.getClassesByTime(instructor_username, time, duration);

        if (existingClasses.length > 0) {
            return res.status(400).json({ message: 'This time slot is already occupied.' });
        }
        
        const result = await classModel.createClass({
            title,
            description,
            time,
            max_participants: maxParticipants,
            duration,
            instructor_username
        });

        await notificationModel.createNotification({
            username: instructor_username,
            message: `Your class ${title} has been created successfully.`
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Failed to create class.' });
    }
};

const getClassesByInstructor = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const classes = await classModel.getClassesByInstructor(username);
        return res.status(200).json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        return res.status(500).json({ message: 'Error fetching classes' });
    }
};

const getClassParticipants = async (req, res) => {
    const classId = req.params.id;

    try {
        const participants = await classRegistrationModel.getParticipantsByClassId(classId);

        if (!participants) {
            return res.status(404).json({ message: 'No participants found for this class' });
        }

        res.status(200).json(participants);
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Failed to fetch participants' });
    }
};

const updateClass = async (req, res) => {
    const classId = req.params.id;
    const { title, description, time, maxParticipants, duration, instructor_username } = req.body;

    try {
        const existingClass = await classModel.getClassById(classId);
        if (!existingClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        await classModel.updateClass(classId, {
            title,
            description,
            time,
            maxParticipants,
            duration
        });

        await notificationModel.createNotification({
            username: instructor_username,
            message: `Your class "${title}" has been updated successfully.`
        });

        res.status(200).json({ message: 'Class updated successfully' });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ message: 'Failed to update class' });
    }
};

const deleteClass = async (req, res) => {
    const classId = req.params.id;

    try {
        const existingClass = await classModel.getClassById(classId);
        if (!existingClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        await classModel.deleteClassById(classId);

        await notificationModel.createNotification({
            username: existingClass.instructor_username,
            message: `Your class "${existingClass.title}" has been deleted.`
        });

        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ message: 'Failed to delete class' });
    }
};

const getAvailableClasses = async (req, res) => {
    try {
        const currentTime = new Date();
        const availableClasses = await classModel.getAvailableClasses(currentTime);
        res.status(200).json(availableClasses);
    } catch (error) {
        console.error('Error fetching available classes:', error);
        res.status(500).json({ message: 'Failed to fetch available classes' });
    }
};

module.exports = {
    createClass,
    getClassesByInstructor,
    updateClass,
    deleteClass,
    getClassParticipants,
    getAvailableClasses
};
