const Room = require('../models/Room_Model');

const WebController = {
    getStaffView: (req, res) => {
        Room.getAll((err) => {
            res.render('staff');
        });
    },
    getUserView: (req, res) => {
        res.render('user');
    },
    getAdminView: (req, res) => {
        // Render admin dashboard for managing user roles
        res.render('admin');
    }
};

module.exports = WebController;