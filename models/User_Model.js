const db = require('../config/db');
const {v4: uuidv4} = require('uuid');

const User = {
    getAll: (callback) => {
        const query = 'SELECT * FROM users WHERE is_deleted = 0'
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        const query = 'SELECT * FROM users WHERE user_id = ? AND is_deleted = 0'
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },
    searchByKeyword: (keyword, callback) => {
        const query = 'SELECT * FROM users WHERE username LIKE ? AND is_deleted = 0'
        db.query(query, [`%${keyword}%`], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    create: (userData, callback) => {
        const query = 'INSERT INTO users (fullname, username, role, password, email, created_at) VALUES (?, ?, ?, ?, ?, ?)'
        const values = [userData.fullname, userData.username, userData.role, userData.password, userData.email, new Date()]
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, userData);
        });
    },
    update: (id, userData, callback) => {
        const query = 'UPDATE users SET username = ?, role = ?, password = ?, email = ? WHERE user_id = ? AND is_deleted = 0'
        const values = [userData.username, userData.role, userData.password, userData.email, id]
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    soft_delete: (id, callback) => {
        const query = 'UPDATE users SET is_deleted = 1 WHERE user_id = ?'
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    restore: (id, callback) => {
        const query = 'UPDATE users SET is_deleted = 0 WHERE user_id = ?'
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    // อื่นๆ ตามต้องการ
    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ? AND is_deleted = 0'
        db.query(query, [email], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },
    findByUsername: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ? AND is_deleted = 0'
        db.query(query, [username], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    }
};
module.exports = User;