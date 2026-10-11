const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Vehicle Management System API is running");
});

app.get('/api', (req, res) => {
    res.send("API working");
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
