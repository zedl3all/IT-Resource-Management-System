const express = require('express');
const router = express.Router();

const WebController = require('../controllers/Web_Controller');

const authenticateToken = require('../middleware/Auth_Middleware');
const checkRole = require('../middleware/CheckRole');

router.get('/', (req, res) => { //?use
    res.render('index');
});

router.get('/register', (req, res) => { //?use
    res.render('register');
});

router.get('/login', (req, res) => { //?use
    res.render('login');
});

router.get('/staff', authenticateToken, checkRole(['admin', 'staff']), WebController.getStaffView); //?use

router.get('/user', authenticateToken, WebController.getUserView); //?use

module.exports = router;