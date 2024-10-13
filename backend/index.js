const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const classRoutes = require('./routes/classRoutes');
const ptSessionRoutes = require ('./routes/ptSessionRoutes')

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/notifications', notificationRoutes);
app.use('/api', classRoutes);
app.use('/api', ptSessionRoutes);

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
