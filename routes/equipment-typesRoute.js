const express = require('express');
const router = express.Router();
const equipmentTypeController = require('../controllers/equipment-types_Controller');

router.get('/', equipmentTypeController.getAllEquipmentTypes);
module.exports = router;