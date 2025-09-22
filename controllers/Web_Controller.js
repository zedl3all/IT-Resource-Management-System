const Room = require('../models/Room_Model');
const maintenance = require('../models/maintenance_Model');
const Equipment = require('../models/Equipment_Model');

const WebController = {
    getStaffView: (req, res) => {
        Room.getAll((err) => {
            res.render('staff');
        });
    },
    getHomeView: (req, res) => {
        res.render('user');
    }
};

module.exports = WebController;