const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/Room_Controller');

// List & search
router.get('/', RoomController.getAllRooms); //?use
router.get('/search/:keyword', RoomController.searchRooms); //!unuse

// User-specific bookings
router.get('/user/:userId/bookings', RoomController.getBookingsByUserId); //?use

// Room bookings
router.get('/:id/bookings/month', RoomController.getBookingsByRoomIdAndMonth); //?use
router.get('/:id/bookings', RoomController.getBookingsByRoomId); //?use
router.get('/:id/availability', RoomController.checkRoomAvailability); //!unuse
router.post('/:id/bookings', RoomController.CreateBooking); //?use
router.delete('/cancel-booking/:id', RoomController.CancelBooking); //?use

// Room CRUD
router.get('/:id', RoomController.getRoomById); //!unuse
router.post('/', RoomController.createRoom); //?use
router.put('/:id', RoomController.updateRoom); //?use
router.delete('/:id', RoomController.softDeleteRoom); //?use
router.post('/:id/restore', RoomController.restoreRoom); //!unuse

module.exports = router;
