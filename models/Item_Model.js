const db = require('../config/db');
const {v4: uuidv4} = require('uuid');

const Item = {
    getAll: (callback) => {
        const query = 'SELECT * FROM items WHERE is_deleted = 0'
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        const query = 'SELECT * FROM items WHERE id = ? AND is_deleted = 0'
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },
    searchByKeyword: (keyword, callback) => {
        const query = 'SELECT * FROM items WHERE name LIKE ? AND is_deleted = 0'
        db.query(query, [`%${keyword}%`], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
    // Add more CRUD operations as needed
}
module.exports = Item;