const db = require('../config/db');
const {v4: uuidv4} = require('uuid');

const EquipmentType = {
    getAll: (callback) => {
        const query = 'SELECT * FROM type'
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    // ? Don't need Because equipment use soft delete
    // deleteFromEquipmentId: (id, callback) => {
    //     const query = 'DELETE FROM equipment_type WHERE type_id = ?';
    //     db.query(query, [id], (err, results) => {
    //         if (err) return callback(err);
    //         callback(null, results);
    //     });
    // },
    // ? Don't need Because use in Equipment Model
    // editTypeByEquipmentId: (e_id, typeIds, callback) => {
    //     const Query = 'UPDATE equipment_type SET type_id = ? WHERE e_id = ?';
    //     db.query(Query, [typeIds, e_id], (err, results) => {
    //         if (err) return callback(err);
    //         callback(null, results);
    //     });
    // },
    // Add more CRUD operations as needed
};

module.exports = EquipmentType;