const User = require('../models/User_Model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const AuthController = {
    register: (req, res) => {
        const { name, email, password } = req.body;
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        // check if user already exists
        User.findByEmail(email, (err, existingUser) => {
            // Handle database errors
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            // If user exists, return conflict
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }
            // hash password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                // Handle hashing errors
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password', error: err });
                }
                const newUser = { username: name, email, password: hashedPassword, role: 'user' };
                // Create user
                User.create(newUser, (err, userId) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database error', error: err });
                    }
                    res.status(201).json({ message: 'User registered successfully', userId });
                });
            });
        });
    },
    login: (req, res) => {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find user by email
        User.findByEmail(email, (err, user) => {
            // Handle database errors
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            // If user not found, return unauthorized
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            // Compare passwords
            bcrypt.compare(password, user.password, (err, isMatch) => {
                // Handle comparison errors
                if (err) {
                    return res.status(500).json({ message: 'Error comparing passwords', error: err });
                }
                // If passwords do not match, return unauthorized
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                // Generate JWT token
                const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: 'Login successful', token });
            });
        });
    }
};

module.exports = AuthController;