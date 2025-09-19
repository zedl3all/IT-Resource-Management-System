const Room = require('../models/Room_Model');
const maintenance = require('../models/maintenance_Model');
const Equipment = require('../models/Equipment_Model');

const WebController = {
    getStaffView: (req, res) => {
        Room.getAll((err, rooms) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            const data = {
                    rooms: rooms
                };
                res.render('staff', { data });
        });
    }
};

module.exports = WebController;