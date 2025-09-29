const Maintenance = require('../models/maintenance_Model');

const MaintenanceController = {
    getAllMaintenances: (req, res) => {
        Maintenance.getAll((err, Maintenances) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ Maintenances });
        });
    },
    getMaintenanceById: (req, res) => {
        const MaintenanceId = req.params.id;
        Maintenance.getById(MaintenanceId, (err, Maintenance) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            if (!Maintenance) return res.status(404).json({
                error: 'Maintenance not found',
                details: `No Maintenance found with ID ${MaintenanceId}`
            });
            res.json(Maintenance);
        });
    },
    searchMaintenances: (req, res) => {
        const keyword = req.query.keyword;
        Maintenance.searchByKeyword(keyword, (err, Maintenances) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json(Maintenances);
        });
    },
    createMaintenance: (req, res) => {
        const MaintenanceData = req.body;
        Maintenance.create(MaintenanceData, (err, MaintenanceId) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'create' });
            // --- emit to clients ---
            res.status(201).json({ MaintenanceId });
        });
    },
    updateMaintenance: (req, res) => {
        const MaintenanceId = req.params.id;
        const MaintenanceData = req.body;
        Maintenance.update(MaintenanceId, MaintenanceData, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'update', id: MaintenanceId });
            // --- emit to clients ---
            res.json({
                message: 'Maintenance updated successfully',
                details: results
            });
        });
    },
    softDeleteMaintenance: (req, res) => {
        const MaintenanceId = req.params.id;
        Maintenance.soft_delete(MaintenanceId, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'soft_delete', id: MaintenanceId });
            // --- emit to clients ---
            res.json({
                message: 'Maintenance soft deleted successfully',
                details: results
            });
        });
    },
    restoreMaintenance: (req, res) => {
        const MaintenanceId = req.params.id;
        Maintenance.restore(MaintenanceId, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'restore', id: MaintenanceId });
            // --- emit to clients ---
            res.json({
                message: 'Maintenance restored successfully',
                details: results
            });
        });
    },
    updateStaffAndStatus: (req, res) => {
        const MaintenanceId = req.params.id;
        const { staff_id, status } = req.body;
        Maintenance.updateStaffAndStatus(MaintenanceId, staff_id, status, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'update', id: MaintenanceId });
            // --- emit to clients ---
            res.json({
                message: 'Maintenance staff and status updated successfully',
                details: results
            });
        });
    },
    getMaintenancesByUserId: (req, res) => {
        const userId = req.params.userId;
        Maintenance.getByUserId(userId, (err, maintenances) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ maintenances });
        });
    }
}

module.exports = MaintenanceController;