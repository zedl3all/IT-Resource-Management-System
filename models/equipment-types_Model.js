const db = require('../config/db');
const {v4: uuidv4} = require('uuid');

const EquipmentType = {
    getAll: (callback) => {
        const query = 'SELECT * FROM type'
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
    // Add more CRUD operations as needed
}

module.exports = EquipmentType;