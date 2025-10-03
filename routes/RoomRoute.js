const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/Room_Controller');

// List & search
router.get('/', RoomController.getAllRooms);
router.get('/search/:keyword', RoomController.searchRooms);

// User-specific bookings
router.get('/user/:userId/bookings', RoomController.getBookingsByUserId);

// Room bookings
router.get('/:id/bookings/month', RoomController.getBookingsByRoomIdAndMonth);
router.get('/:id/bookings', RoomController.getBookingsByRoomId);
router.get('/:id/availability', RoomController.checkRoomAvailability);
router.post('/:id/bookings', RoomController.CreateBooking);
router.delete('/cancel-booking/:id', RoomController.CancelBooking);

// Room CRUD
router.get('/:id', RoomController.getRoomById);
router.post('/', RoomController.createRoom);
router.put('/:id', RoomController.updateRoom);
router.delete('/:id', RoomController.softDeleteRoom);
router.post('/:id/restore', RoomController.restoreRoom);

module.exports = router;
