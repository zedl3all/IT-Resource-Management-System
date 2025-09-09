const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth_Controller');
const User = require('../models/User_Model');
const authenticateToken = require('../middleware/Auth_Middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/profile', authenticateToken, User.getById);

module.exports = router;