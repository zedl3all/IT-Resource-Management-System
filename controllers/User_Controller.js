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
        const keyword = req.query.q;
        User.searchByKeyword(keyword, (err, users) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });
            res.status(200).json(users);
        });
    }
};

module.exports = UserController;
