const express = require('express');
const router = express.Router();

const WebController = require('../controllers/Web_Controller');

const authenticateToken = require('../middleware/Auth_Middleware');
const checkRole = require('../middleware/CheckRole');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/staff', authenticateToken, checkRole(['admin', 'staff']), WebController.getStaffView);

router.get('/user', authenticateToken, WebController.getUserView);

module.exports = router;