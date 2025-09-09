const Room = require('../models/Room_Model');
const repair = require('../models/maintenance_Model');

const WebController = {
    getStaffView: (req, res) => {
        Room.getAll((err, rooms) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            repair.getAll((err, repairs) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err.message });
                }

                const data = {
                    title: "Staff Page",
                    rooms: rooms,
                    repairs: repairs
                };
                res.render('staff', { data });
            });
        });
    }
};

module.exports = WebController;