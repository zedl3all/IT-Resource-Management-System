const express = require('express');
const router = express.Router();

const UserController = require('../controllers/User_Controller');
router.get('/', UserController.getUserView);

router.get('/register', (req, res) => {
    res.render('register');
});



module.exports = router;