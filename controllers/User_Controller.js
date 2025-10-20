const User = require('../models/User_Model');

const UserController = {
    getAllUsers: (req, res) => {
        User.getAll((err, users) => {
            if (err) return res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ success: true, users });
        });
    },
    getUserById: (req, res) => {
        const userId = req.params.id;
        User.getById(userId, (err, user) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            if (!user) return res.status(404).json({
                error: 'User not found',
                details: `No user found with ID ${userId}`
            });
            res.status(200).json(user);
        });
    },
    searchUsers: (req, res) => {
        const { keyword } = req.params;
        User.searchByKeyword(keyword, (err, users) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json(users);
        });
    },
    createUser: (req, res) => {
        const userData = req.body;
        User.create(userData, (err, result) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(201).json({ result });
        });
    },
    updateUser: (req, res) => {
        const userId = req.params.id;
        const userData = req.body;
        User.update(userId, userData, (err, result) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({
                message: 'User updated successfully',
                details: result
            });
        });
    },
    updateUserRole: (req, res) => {
        const userId = req.params.id;
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ success: false, message: 'Role is required' });
        }
        User.updateRole(userId, role, (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'Internal server error', details: err.message });
            return res.status(200).json({ success: true, message: 'Role updated successfully', details: result });
        });
    },
    softDeleteUser: (req, res) => {
        const userId = req.params.id;
        User.soft_delete(userId, (err, result) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({
                message: 'User soft deleted successfully',
                details: result
            });
        });
    },
    restoreUser: (req, res) => {
        const userId = req.params.id;
        User.restore(userId, (err, result) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({
                message: 'User restored successfully',
                details: result
            });
        });
    },
    // Render user view
    getUserView: (req, res) => {
        User.getAll((err, users) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.render('test', { users }); // Assuming 'test' is the EJS template for displaying users
        });
    },
    findByEmail: (req, res) => {
        const email = req.params.email;
        User.findByEmail(email, (err, user) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            if (!user) return res.status(404).json({
                error: 'User not found',
                details: `No user found with email ${email}`
            });
            res.status(200).json(user);
        });
    },
    findByUsername: (req, res) => {
        const username = req.params.username;
        User.findByUsername(username, (err, user) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            if (!user) return res.status(404).json({
                error: 'User not found',
                details: `No user found with username ${username}`
            });
            res.status(200).json(user);
        });
    },
    getAllStaff: (req, res) => {
        User.getAllStaff((err, users) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ users });
        });
    }
};

module.exports = UserController;
