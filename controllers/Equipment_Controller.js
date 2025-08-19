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
    },
    getEquipmentById: (req, res) => {
        const equipmentId = req.params.id;
        Equipment.getById(equipmentId, (err, equipment) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            if (!equipment) return res.status(404).json({
                error: 'Equipment not found',
                details: `No equipment found with ID ${equipmentId}`
            });
            res.json({ equipment });
        });
    },
    searchEquipment: (req, res) => {
        const keyword = req.query.keyword;
        Equipment.searchByKeyword(keyword, (err, equipment) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json({ equipment });
        });
    },
    createEquipment: (req, res) => {
        const equipmentData = req.body;
        Equipment.create(equipmentData, (err, equipmentId) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(201).json({ equipmentId });
        });
    },
    updateEquipment: (req, res) => {
        const equipmentId = req.params.id;
        const equipmentData = req.body;
        Equipment.update(equipmentId, equipmentData, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json({
                message: 'Equipment updated successfully',
                details: results
            });
        });
    },
    softDeleteEquipment: (req, res) => {
        const equipmentId = req.params.id;
        Equipment.soft_delete(equipmentId, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json({
                message: 'Equipment soft deleted successfully',
                details: results
            });
        });
    },
    restoreEquipment: (req, res) => {
        const equipmentId = req.params.id;
        Equipment.restore(equipmentId, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json({
                message: 'Equipment restored successfully',
                details: results
            });
        });
    }
}
module.exports = EquipmentController;