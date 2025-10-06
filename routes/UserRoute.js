const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User_Controller');

router.get('/', UserController.getAllUsers); //!unuse
router.get('/:id', UserController.getUserById); //!unuse
router.get('/search/:keyword', UserController.searchUsers); //!unuse
router.post('/', UserController.createUser); //!unuse
router.put('/:id', UserController.updateUser); //!unuse
router.delete('/:id', UserController.softDeleteUser); //!unuse
router.post('/:id/restore', UserController.restoreUser); //!unuse

router.get('/findByEmail/:email', UserController.findByEmail); // New route to find user by email //!unuse
router.get('/findByUsername/:username', UserController.findByUsername); // New route to find user by username //!unuse

router.get('/staff/all', UserController.getAllStaff); // New route to get all staff users //?use

module.exports = router;