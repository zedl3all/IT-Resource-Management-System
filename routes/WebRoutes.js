const express = require('express');
const router = express.Router();

const UserController = require('../controllers/User_Controller');
router.get('/', UserController.getUserView);

const EquipmentController = require('../controllers/Equipment_Controller');

router.get('/register', (req, res) => {
    res.render('register/register', {
        pageTitle: 'เพิ่มอุปกรณ์',
        heading: 'ฟอร์มเพิ่มอุปกรณ์',
        assetTypes: ['Laptop', 'Printer', 'Projector'],
        statuses: ['พร้อมใช้งาน', 'ซ่อมบำรุง', 'ชำรุด']
    });
});

router.post('/add-asset', EquipmentController.createEquipment);

module.exports = router;