const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User_Controller');

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.get('/search', UserController.searchUsers);

module.exports = router;