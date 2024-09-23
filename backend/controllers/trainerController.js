const trainerModel = require('../models/trainerModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const notificationModel = require('../models/notificationModel');

const getTrainers = async (req, res) => {
    try {
        const trainers = await trainerModel.getAllTrainers();
        return res.status(200).json(trainers);
    } catch (err) {
        console.error('Error fetching trainers:', err);
        return res.status(500).json({ message: 'Error fetching trainers' });
    }
};

const createTrainer = async (req, res) => {
    const { username, fullName, email, phone, specialization } = req.body;

    try {
        const result = await trainerModel.createTrainer({ username, fullName, email, phone, specialization });

        const hashedPassword = await bcrypt.hash('1', 10);
        const userData = {
            username,
            password: hashedPassword,
            email,
            phone,
            role: 'trainer'
        };
        await userModel.createUser(userData);

        await notificationModel.createNotification({
            username,
            message: 'Your trainer account has been created successfully.'
        });

        return res.status(201).json({
            message: 'Trainer created successfully',
            newTrainer: {
                id: result.insertId,
                username,
                full_name: fullName,
                email,
                phone,
                specialization,
                status: 'inactive'
            }
        });
    } catch (err) {
        console.error('Error creating trainer:', err);
        return res.status(500).json({ message: 'Error creating trainer' });
    }
};

const updateTrainer = async (req, res) => {
    const { username } = req.params;
    const { fullName } = req.body;

    try {
        const trainer = await trainerModel.getTrainerByUsername(username);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        const updatedTrainer = {
            full_name: fullName || trainer.full_name
        };

        await trainerModel.updateTrainerByUsername(username, updatedTrainer);

        return res.status(200).json({ message: 'Trainer updated successfully' });
    } catch (err) {
        console.error('Error updating trainer:', err);
        return res.status(500).json({ message: 'Error updating trainer' });
    }
};

const deleteTrainer = async (req, res) => {
    const { username } = req.params;

    try {
        const trainer = await trainerModel.getTrainerByUsername(username);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        await trainerModel.deleteTrainerByUsername(username);

        await userModel.deleteUserByUsername(username);

        res.status(200).json({ message: 'Trainer and corresponding account deleted successfully' });
    } catch (error) {
        console.error('Error deleting trainer:', error);
        res.status(500).json({ message: 'Failed to delete trainer' });
    }
};

const changePassword = async (req, res) => {
    const { username } = req.params;
    const { newPassword } = req.body;

    try {
        const trainer = await trainerModel.getTrainerByUsername(username);

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await trainerModel.updatePassword(username, hashedPassword);
        await trainerModel.updateStatus(username, 'active');

        res.status(200).json({ message: 'Password changed successfully, status updated to active' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
};

module.exports = {
    createTrainer,
    updateTrainer,
    getTrainers,
    deleteTrainer,
    changePassword
};
