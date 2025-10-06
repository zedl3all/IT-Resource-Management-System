const Equipment = require('../models/Equipment_Model');

const EquipmentController = {
    getAllEquipment: (req, res) => {
        Equipment.getAll((err, equipments) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ equipments });
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
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('equipments:changed', { action: 'create' });
            // --- emit to clients ---
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
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('equipments:changed', { action: 'update', id: equipmentId });
            // --- emit to clients ---
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
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('equipments:changed', { action: 'soft_delete', id: equipmentId });
            // --- emit to clients ---
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
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('equipments:changed', { action: 'restore', id: equipmentId });
            // --- emit to clients ---
            res.json({
                message: 'Equipment restored successfully',
                details: results
            });
        });
    },
    getLoanByUserId: (req, res) => {
        const userId = req.params.userId;
        Equipment.getLoanByUserId(userId, (err, loans) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ loans });
        });
    },
    getLoanByEquipmentId: (req, res) => {
        const equipmentId = req.params.equipmentId;
        Equipment.getLoanByEquipmentId(equipmentId, (err, loans) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ loans });
        });
    },
    createLoan: (req, res) => {
        const loanData = req.body;
        Equipment.createLoan(loanData, (err, result) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('loans:changed', { action: 'create' });
            // --- emit to clients ---
            res.status(201).json({ message: 'Loan created successfully', loanId: result.insertId });
        });
    },
    returnLoan: (req, res) => {
        const loanId = req.params.loanId;
        
        // Remove the status parameter that's causing the issue
        Equipment.returnLoan(loanId, (err, result) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('loans:changed', { action: 'update', id: loanId });
            // --- emit to clients ---
            
            res.json({
                success: true,
                message: 'Loan returned successfully',
                data: result
            });
        });
    }
};
module.exports = EquipmentController;