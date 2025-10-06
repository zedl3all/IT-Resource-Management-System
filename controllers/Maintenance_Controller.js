const Maintenance = require('../models/Maintenance_Model');
const upload = require('../middleware/Upload_Middleware');
const path = require('path');

const handleUpload = upload.single('image'); // Middleware to handle a single image upload

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
        handleUpload(req, res, function(err) {
            if (err) {
                return res.status(400).json({
                    error: 'File upload error',
                    details: err.message
                });
            }
            
            // Get the maintenance data from the request body
            const maintenanceData = req.body;
            
            // Add image path if a file was uploaded
            if (req.file) {
                // Update the path to match the new location
                maintenanceData.image = '/Images/maintenance/' + path.basename(req.file.path);
            }
            
            // Set default values if not provided
            maintenanceData.DT_report = maintenanceData.DT_report || new Date().toISOString();
            maintenanceData.staff_id = maintenanceData.staff_id || null;
            maintenanceData.status = maintenanceData.status || 0; // Default to pending
            
            // Include equipment information in problem description if available
            if (maintenanceData.equipment) {
                maintenanceData.problem_description = `อุปกรณ์: ${maintenanceData.equipment}\n${maintenanceData.problem_description}`;
            }
            
            // Create the maintenance record
            Maintenance.create(maintenanceData, (err, maintenanceId) => {
                if (err) return res.status(500).json({
                    error: 'Internal server error',
                    details: err.message
                });
                
                // Emit event to clients
                const io = req.app.get('io');
                if (io) io.emit('maintenances:changed', { action: 'create' });
                
                res.status(201).json({ maintenanceId });
            });
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