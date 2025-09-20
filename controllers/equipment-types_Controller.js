const equipment_typeModel = require('../models/equipment-types_Model');

const equipmentTypeController = {
    // Get all equipment types
    getAllEquipmentTypes: (req, res) => {
        equipment_typeModel.getAll((err, types) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(types);
        });
    }
}

module.exports = equipmentTypeController;
