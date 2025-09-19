const db = require('../config/db');
const {v4: uuidv4} = require('uuid');

const Room = {
    getAll: (callback) => {
        const query = 'SELECT * FROM rooms WHERE is_deleted = 0'
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        const query = 'SELECT * FROM rooms WHERE room_id = ? AND is_deleted = 0'
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },
    searchByKeyword: (keyword, callback) => {
        const query = 'SELECT * FROM rooms WHERE room_name LIKE ? AND is_deleted = 0'
        db.query(query, [`%${keyword}%`], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    // Add more CRUD operations as needed
    create: (roomData, callback) => {
        const query = 'INSERT INTO rooms (room_id, room_name, description, capacity) VALUES (?, ?, ?, ?)';
        const values = [roomData.name, roomData.description, roomData.capacity];
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, roomData);
        });
    },
    update: (id, roomData, callback) => {
        const query = 'UPDATE rooms SET room_name = ?, description = ?, capacity = ? WHERE room_id = ? AND is_deleted = 0';
        const values = [roomData.name, roomData.description, roomData.capacity, id];
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    soft_delete: (id, callback) => {
        const query = 'UPDATE rooms SET is_deleted = 1 WHERE room_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    restore: (id, callback) => {
        const query = 'UPDATE rooms SET is_deleted = 0 WHERE room_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getBookingsByRoomId: (id, callback) => {
        const query = 'SELECT start_time, end_time, users.username, purpose FROM booking JOIN users ON booking.user_id = users.user_id WHERE room_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getBookingsByRoomIdAndMonth: (id, month, callback) => {
        const query = `
        SELECT start_time, end_time, users.username, purpose
        FROM booking
        JOIN users ON booking.user_id = users.user_id
        WHERE room_id = ? AND DATE_FORMAT(start_time, '%Y-%m') = ?
        `;
        db.query(query, [id, month], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
}
module.exports = Room;