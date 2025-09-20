const db = require('../config/db');
const {v4: uuidv4} = require('uuid');

const broken_items = {
    getAll: (callback) => {
        const query = `SELECT M.*, USER.username as username, STAFF.username as staff_username
                    FROM maintenance as M
                    JOIN users as USER ON M.user_id = USER.user_id
                    JOIN users as STAFF ON M.staff_id = STAFF.user_id;`
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        const query = 'SELECT * FROM maintenance WHERE request_id = ? '
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },
    searchByKeyword: (keyword, callback) => {
        const query = 'SELECT * FROM maintenance WHERE problem_description LIKE ? '
        db.query(query, [`%${keyword}%`], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    create: (data, callback) => {
        const request_id = uuidv4().replace(/[^0-9]/g, '').slice(0, 8);
        const { problem_description, user_id, location, image, DT_report, staff_id, status } = data;
        const query = 'INSERT INTO maintenance (request_id, problem_description, user_id, location, image, DT_report, staff_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [request_id, problem_description, user_id, location, image, DT_report, staff_id, status], (err, results) => {
            if (err) return callback(err);
            callback(null, { request_id, ...data });
        });
    },
    update: (id, data, callback) => {
        const { problem_description, user_id, location, image, DT_report, staff_id, status } = data;
        const query = 'UPDATE maintenance SET problem_description = ?, user_id = ?, location = ?, image = ?, DT_report = ?, staff_id = ?, status = ? WHERE request_id = ?';
        db.query(query, [problem_description, user_id, location, image, DT_report, staff_id, status, id], (err, results) => {
            if (err) return callback(err);
            callback(null, { request_id: id, ...data });
        }
        );
    },
    // no delete function for maintenance records
}
module.exports = broken_items;