const userModel = require('../models/userModel');
const customerModel = require('../models/customerModel');
const trainerModel = require('../models/trainerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        let additionalInfo;
        if (user.role === 'customer') {
            additionalInfo = await customerModel.getCustomerByUsername(user.username);
        } else if (user.role === 'trainer') {
            additionalInfo = await trainerModel.getTrainerByUsername(user.username);
        }

        const userData = {
            username: user.username,
            role: user.role,
            ...additionalInfo
        };

        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token, user: userData });
    } catch (err) {
        console.error('Error logging in:', err);
        return res.status(500).json({ message: 'Error logging in' });
    }
};

module.exports = {
    login
};
