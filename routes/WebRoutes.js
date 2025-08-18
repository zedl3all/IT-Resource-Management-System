const express = require('express');
const router = express.Router();

const UserController = require('../controllers/User_Controller');
router.get('/', UserController.getUserView);

module.exports = router;