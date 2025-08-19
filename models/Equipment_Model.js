const db = require('../config/db');
const {v4: uuidv4} = require('uuid');

const Equipment = {
    getAll: (callback) => {
        const query = 'SELECT * FROM equipment WHERE is_deleted = 0'
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        const query = 'SELECT * FROM equipment WHERE e_id = ? AND is_deleted = 0'
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },
    searchByKeyword: (keyword, callback) => {
        const query = 'SELECT * FROM equipment WHERE name LIKE ? AND is_deleted = 0'
        db.query(query, [`%${keyword}%`], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    // Add more CRUD operations as needed
    create: (data, callback) => {
        const query = 'INSERT INTO equipment (e_id, name, status) VALUES (?, ?, ?)'
        const values = [uuidv4(), data.name, data.status]
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, { id: results.insertId, ...data });
        });
    },
    update: (id, data, callback) => {
        const query = 'UPDATE equipment SET name = ?, status = ? WHERE e_id = ?'
        const values = [data.name, data.status, id]
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    soft_delete: (id, callback) => {
        const query = 'UPDATE equipment SET is_deleted = 1 WHERE e_id = ?'
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    restore: (id, callback) => {
        const query = 'UPDATE equipment SET is_deleted = 0 WHERE e_id = ?'
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
}
module.exports = Equipment;