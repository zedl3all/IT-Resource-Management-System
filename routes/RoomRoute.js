const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/Room_Controller');

router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomById);
router.get('/search/:keyword', RoomController.searchRooms);
router.post('/', RoomController.createRoom);
router.put('/:id', RoomController.updateRoom);
router.delete('/:id', RoomController.softDeleteRoom);
router.post('/:id/restore', RoomController.restoreRoom);

module.exports = router;
