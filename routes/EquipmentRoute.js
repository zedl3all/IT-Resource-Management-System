const express = require('express');
const router = express.Router();
const EquipmentController = require('../controllers/Equipment_Controller');

router.get('/', EquipmentController.getAllEquipment);
router.get('/:id', EquipmentController.getEquipmentById);
router.get('/search/:keyword', EquipmentController.searchEquipment);
router.post('/', EquipmentController.createEquipment);
router.put('/:id', EquipmentController.updateEquipment);
router.delete('/:id', EquipmentController.softDeleteEquipment);
router.post('/:id/restore', EquipmentController.restoreEquipment);

module.exports = router;
