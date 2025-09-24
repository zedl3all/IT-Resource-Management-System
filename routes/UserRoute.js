const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User_Controller');

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.get('/search/:keyword', UserController.searchUsers);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.softDeleteUser);
router.post('/:id/restore', UserController.restoreUser);

router.get('/findByEmail/:email', UserController.findByEmail); // New route to find user by email
router.get('/findByUsername/:username', UserController.findByUsername); // New route to find user by username

router.get('/staff/all', UserController.getAllStaff); // New route to get all staff users

module.exports = router;