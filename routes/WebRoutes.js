const express = require('express');
const router = express.Router();

const UserController = require('../controllers/User_Controller');
const WebController = require('../controllers/Web_Controller');
router.get('/', UserController.getUserView);

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/staff', WebController.getStaffView);

module.exports = router;