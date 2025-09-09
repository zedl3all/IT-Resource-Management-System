const express = require('express');
const router = express.Router();

const UserController = require('../controllers/User_Controller');
router.get('/', UserController.getUserView);

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;