const trainerModel = require('../models/trainerModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

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

    const trainerData = {
        username,
        full_name: fullName,
        email,
        phone,
        specialization
    };

    try {
        // Kiểm tra trùng lặp trong bảng users
        const existingUser = await userModel.checkUserExists(username, email, phone);
        if (existingUser.length > 0) {
            const existingFields = {};
            existingUser.forEach(user => {
                if (user.username === username) existingFields.username = 'Username';
                if (user.email === email) existingFields.email = 'Email';
                if (user.phone === phone) existingFields.phone = 'Phone';
            });
            return res.status(409).json({ message: 'Duplicate information in users', existingFields });
        }

        // Tạo trainer mới trong bảng trainers
        const result = await trainerModel.createTrainer(trainerData);
        const newTrainerId = result.insertId;

        // Tạo tài khoản trainer trong bảng users với password mặc định là '1'
        const hashedPassword = await bcrypt.hash('1', 10);
        const userData = {
            username,
            password: hashedPassword,
            email,
            phone,
            role: 'trainer'
        };
        await userModel.createUser(userData);

        return res.status(201).json({
            message: 'Trainer created successfully',
            newTrainer: {
                id: newTrainerId,
                username,
                full_name: fullName,
                email,
                phone,
                specialization
            }
        });
    } catch (err) {
        console.error('Error creating trainer:', err);
        return res.status(500).json({ message: 'Error creating trainer' });
    }
};


const updateTrainer = async (req, res) => {
    const { username } = req.params;
    const { fullName, email, phone, specialization } = req.body;

    try {
        // Kiểm tra xem trainer có tồn tại không
        const trainer = await trainerModel.getTrainerByUsername(username);

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        // Dữ liệu để cập nhật trainer
        const updatedTrainer = {
            full_name: fullName,
            email,
            phone,
            specialization
        };

        // Cập nhật trainer
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
        // Tìm trainer dựa trên username
        const trainer = await trainerModel.getTrainerByUsername(username);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        // Xóa trainer trong bảng trainers
        await trainerModel.deleteTrainerByUsername(username);

        // Xóa tài khoản tương ứng trong bảng users
        await userModel.deleteUserByUsername(username);

        res.status(200).json({ message: 'Trainer and corresponding account deleted successfully' });
    } catch (error) {
        console.error('Error deleting trainer:', error);
        res.status(500).json({ message: 'Failed to delete trainer' });
    }
};

module.exports = {
    createTrainer,
    updateTrainer,
    getTrainers,
    deleteTrainer
};
