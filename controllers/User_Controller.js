const User = require('../models/User_Model');

const UserController = {
    getAllUsers: (req, res) => {
        User.getAll((err, users) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });
            res.status(200).json(users);
        });
    },
    getUserById: (req, res) => {
        const userId = req.params.id;
        User.getById(userId, (err, user) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(user);
        });
    },
    searchUsers: (req, res) => {
        const { keyword } = req.params;
        User.searchByKeyword(keyword, (err, users) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });
            res.status(200).json(users);
        });
    },
    createUser: (req, res) => {
        const userData = req.body;
        User.create(userData, (err, result) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });
            res.status(201).json({ message: 'User created successfully' });
        });
    },
    updateUser: (req, res) => {
        const userId = req.params.id;
        const userData = req.body;
        User.update(userId, userData, (err, result) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });
            res.status(200).json({ message: 'User updated successfully' });
        });
    },
    softDeleteUser: (req, res) => {
        const userId = req.params.id;
        User.soft_delete(userId, (err, result) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });
            res.status(200).json({ message: 'User soft deleted successfully' });
        });
    },
    restoreUser: (req, res) => {
        const userId = req.params.id;
        User.restore(userId, (err, result) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });
            res.status(200).json({ message: 'User restored successfully' });
        });
    }
};

module.exports = UserController;
