// server.js
require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGO_URI);

const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware

app.use('/api/auth', require('./routes/auth'));
app.use(express.json());


// Sample Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
console.log('MongoDB URI:', process.env.MONGO_URI);

