const Room = require('../models/Room_Model');

const WebController = {
    getStaffView: (req, res) => {
        Room.getAll((err) => {
            res.render('staff');
        });
    },
    getUserView: (req, res) => {
        res.render('user');
    }
};

module.exports = WebController;