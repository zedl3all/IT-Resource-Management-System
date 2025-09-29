const Room = require('../models/Room_Model');

const RoomController = {
    getAllRooms: (req, res) => {
        Room.getAll((err, rooms) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ rooms });
        });
    },
    getRoomById: (req, res) => {
        const roomId = req.params.id;
        Room.getById(roomId, (err, room) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            if (!room) return res.status(404).json({
                error: 'Room not found',
                details: `No room found with ID ${roomId}`
            });
            res.json(room);
        });
    },
    searchRooms: (req, res) => {
        const keyword = req.query.keyword;
        Room.searchByKeyword(keyword, (err, rooms) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json(rooms);
        });
    },
    createRoom: (req, res) => {
        const roomData = req.body;
        Room.create(roomData, (err, roomId) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('rooms:changed', { action: 'create' });
            // --- emit to clients ---
            res.status(201).json({ roomId });
        });
    },
    updateRoom: (req, res) => {
        const roomId = req.params.id;
        const roomData = req.body;
        Room.update(roomId, roomData, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('rooms:changed', { action: 'update', id: roomId });
            // --- emit to clients ---
            res.json({
                message: 'Room updated successfully',
                details: results
            });
        });
    },
    softDeleteRoom: (req, res) => {
        const roomId = req.params.id;
        Room.soft_delete(roomId, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('rooms:changed', { action: 'soft_delete', id: roomId });
            // --- emit to clients ---
            res.json({
                message: 'Room soft deleted successfully',
                details: results
            });
        });
    },
    restoreRoom: (req, res) => {
        const roomId = req.params.id;
        Room.restore(roomId, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('rooms:changed', { action: 'restore', id: roomId });
            // --- emit to clients ---
            res.json({
                message: 'Room restored successfully',
                details: results
            });
        });
    },
    getBookingsByRoomId: (req, res) => {
        const roomId = req.params.id;
        Room.getBookingsByRoomId(roomId, (err, bookings) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json(bookings);
        });
    },
    getBookingsByRoomIdAndMonth: (req, res) => {
        const roomId = req.params.id;
        const month = req.query.month;
        Room.getBookingsByRoomIdAndMonth(roomId, month, (err, bookings) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json(bookings);
        });
    },
    getBookingsByUserId: (req, res) => {
        const userId = req.params.userId;
        Room.getBookingByUserId(userId, (err, bookings) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json(bookings);
        });
    },
}

module.exports = RoomController;