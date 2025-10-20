const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User_Controller');
const authenticateToken = require('../middleware/Auth_Middleware');
const checkRole = require('../middleware/CheckRole');

// Secure admin endpoints first to avoid being shadowed by generic ':id'
router.get('/', authenticateToken, checkRole('admin'), UserController.getAllUsers); // ?used by admin page
router.get('/staff/all', authenticateToken, checkRole(['admin', 'staff']), UserController.getAllStaff); // ?used by staff page
router.get('/search/:keyword', authenticateToken, checkRole('admin'), UserController.searchUsers); //!unuse
router.post('/', authenticateToken, checkRole('admin'), UserController.createUser); //!unuse
router.put('/:id', authenticateToken, checkRole('admin'), UserController.updateUser); //!unuse
router.patch('/:id/role', authenticateToken, checkRole('admin'), UserController.updateUserRole);
router.delete('/:id', authenticateToken, checkRole('admin'), UserController.softDeleteUser); //!unuse
router.post('/:id/restore', authenticateToken, checkRole('admin'), UserController.restoreUser); //!unuse
router.get('/findByEmail/:email', authenticateToken, checkRole('admin'), UserController.findByEmail); //!unuse
router.get('/findByUsername/:username', authenticateToken, checkRole('admin'), UserController.findByUsername); //!unuse

// Generic by-id route at the end
router.get('/:id', authenticateToken, checkRole('admin'), UserController.getUserById); //!unuse

module.exports = router;