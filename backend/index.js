const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/trainers', trainerRoutes); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
