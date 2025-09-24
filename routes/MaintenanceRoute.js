const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/Maintenance_Controller');

router.get('/', MaintenanceController.getAllMaintenances);
router.get('/:id', MaintenanceController.getMaintenanceById);
router.get('/search/:keyword', MaintenanceController.searchMaintenances);
router.post('/', MaintenanceController.createMaintenance);
router.put('/:id', MaintenanceController.updateMaintenance);
router.delete('/:id', MaintenanceController.softDeleteMaintenance);
router.post('/:id/restore', MaintenanceController.restoreMaintenance);

router.patch('/:id/updateStaffAndStatus', MaintenanceController.updateStaffAndStatus);

module.exports = router;
