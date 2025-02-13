// routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, surname, userId, password, dob, address } = req.body;
    
    // Debug Log: Check if request data is received
    console.log('Request Body:', req.body);

    // Check if user already exists
    const userExists = await User.findOne({ userId });
    if (userExists) {
        console.log('User already exists');
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        // Convert dob to Date object
        const formattedDob = new Date(dob);

        // Create new user
        const user = new User({ name, surname, userId, password, dob: formattedDob, address });
        await user.save();
        console.log('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    console.log('Login Request:', req.body);

    try {
        // Find user by userId
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Test Route
router.get('/test', (req, res) => {
    res.send('Auth route working');
});

module.exports = router;
