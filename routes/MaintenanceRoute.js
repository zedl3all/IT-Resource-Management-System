const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/Maintenance_Controller');

router.get('/', MaintenanceController.getAllMaintenances); //?use
router.get('/:id', MaintenanceController.getMaintenanceById); //!unuse
router.get('/search/:keyword', MaintenanceController.searchMaintenances); //!unuse

// The createMaintenance method now handles the file upload internally
router.post('/', MaintenanceController.createMaintenance); //?use

router.put('/:id', MaintenanceController.updateMaintenance); //!unuse
router.delete('/:id', MaintenanceController.softDeleteMaintenance); //!unuse
router.post('/:id/restore', MaintenanceController.restoreMaintenance); //!unuse
router.get('/user/:userId', MaintenanceController.getMaintenancesByUserId); //?use
router.patch('/:id/updateStaffAndStatus', MaintenanceController.updateStaffAndStatus); //?use

module.exports = router;
