const User = require('../models/User_Model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const AuthController = {
    register: (req, res) => {
        const { fullname, email, username, password, confirmPassword } = req.body;

        // Validate input
        if (!fullname || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if user already exists
        User.findByEmail(email, (err, existingUser) => {
            // Handle database errors
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            // If user exists, return conflict
            if (existingUser) {
                return res.status(409).json({ message: 'Email already registered' });
            }

            // Check if username is already taken
            User.findByUsername(username, (err, existingUsername) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err.message });
                }

                if (existingUsername) {
                    return res.status(409).json({ message: 'Username already taken' });
                }

                // Hash password
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    // Handle hashing errors
                    if (err) {
                        return res.status(500).json({ message: 'Error hashing password', error: err.message });
                    }

                    const newUser = {
                        fullname: fullname,
                        username: username,
                        email: email,
                        password: hashedPassword,
                        role: 'user'
                    };

                    // Create user
                    User.create(newUser, (err, userId) => {
                        if (err) {
                            return res.status(500).json({ message: 'Database error', error: err.message });
                        }
                        res.status(201).json({ message: 'User registered successfully', userId });
                    });
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
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            
            // Compare passwords
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: 'Error comparing passwords', error: err });
                }
                
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                
                // Generate JWT token
                const token = jwt.sign(
                    { userId: user.user_id, role: user.role || 'user' }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '24h' }
                );
                
                // เก็บ token ใน cookie เท่านั้น
                res.cookie('token', token, {
                    httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
                    secure: process.env.NODE_ENV === 'production', // ใช้ HTTPS ในโหมด production
                    maxAge: 24 * 60 * 60 * 1000, // 24 ชั่วโมง
                    sameSite: 'strict' // ป้องกัน CSRF
                });

                
                
                // ส่งข้อมูลกลับโดยไม่ส่ง token (เพราะเก็บใน cookie แล้ว)
                res.status(200).json({ 
                    success: true, 
                    message: 'Login successful', 
                    user: {
                        id: user.user_id,
                        name: user.fullname,
                        role: user.role
                    }
                });
            });
        });
    },

    logout: (req, res) => {
        // ล้าง cookie token
        res.clearCookie('token');
        res.status(200).json({ 
            success: true, 
            message: 'Logout successful' 
        });
    }
};

module.exports = AuthController;