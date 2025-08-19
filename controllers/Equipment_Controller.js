const Equipment = require('../models/equipment_Model');

const EquipmentController = {
    getAllEquipment: (req, res) => {
        Equipment.getAll((err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json({ equipment: results });
        });
    }
}
module.exports = EquipmentController;