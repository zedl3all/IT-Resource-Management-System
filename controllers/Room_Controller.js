const Room = require('../models/Room_Model');

const RoomController = {
    getAllRooms: (req, res) => {
        Room.getAll((err, rooms) => {
            if (err) return res.status(500).json({error: 'Internal server error'}, { error: err.message });
            res.json(rooms);
        });
    },
    getRoomById: (req, res) => {
        const roomId = req.params.id;
        Room.getById(roomId, (err, room) => {
            if (err) return res.status(500).json({error: 'Internal server error'}, { error: err.message });
            res.json(room);
        });
    },
    searchRooms: (req, res) => {
        const keyword = req.query.keyword;
        Room.searchByKeyword(keyword, (err, rooms) => {
            if (err) return res.status(500).json({error: 'Internal server error'}, { error: err.message });
            res.json(rooms);
        });
    },
    createRoom: (req, res) => {
        const roomData = req.body;
        Room.create(roomData, (err, roomId) => {
            if (err) return res.status(500).json({error: 'Internal server error'}, { error: err.message });
            res.status(201).json({ roomId });
        });
    },
    updateRoom: (req, res) => {
        const roomId = req.params.id;
        const roomData = req.body;
        Room.update(roomId, roomData, (err, results) => {
            if (err) return res.status(500).json({error: 'Internal server error'}, { error: err.message });
            res.json({ message: 'Room updated successfully', results });
        });
    },
    softDeleteRoom: (req, res) => {
        const roomId = req.params.id;
        Room.soft_delete(roomId, (err, results) => {
            if (err) return res.status(500).json({error: 'Internal server error'}, { error: err.message });
            res.json({ message: 'Room soft deleted successfully', results });
        });
    },
    restoreRoom: (req, res) => {
        const roomId = req.params.id;
        Room.restore(roomId, (err, results) => {
            if (err) return res.status(500).json({error: 'Internal server error'}, { error: err.message });
            res.json({ message: 'Room restored successfully', results });
        });
    }
}

module.exports = RoomController;