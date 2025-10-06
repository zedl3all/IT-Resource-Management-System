const express = require('express');
const router = express.Router();
const EquipmentController = require('../controllers/Equipment_Controller');

router.get('/', EquipmentController.getAllEquipment); //?use
router.get('/:id', EquipmentController.getEquipmentById); //!unuse
router.get('/search/:keyword', EquipmentController.searchEquipment); //!unuse
router.post('/', EquipmentController.createEquipment); //?use
router.put('/:id', EquipmentController.updateEquipment); //?use
router.delete('/:id', EquipmentController.softDeleteEquipment); //?use
router.post('/:id/restore', EquipmentController.restoreEquipment); //!unuse
router.get('/:equipmentId/loans', EquipmentController.getLoanByEquipmentId); //?use
router.get('/user/:userId/loans', EquipmentController.getLoanByUserId); //?use
router.post('/:id/loans', EquipmentController.createLoan); //?use
router.patch('/:loanId/return', EquipmentController.returnLoan); //?use

module.exports = router;
