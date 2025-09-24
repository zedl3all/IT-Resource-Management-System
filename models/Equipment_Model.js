const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const equipmentTypeModel = require('./equipment-types_Model');

const Equipment = {
    getAll: (callback) => {
        const query = `SELECT eq.* , et.type_id, t.type_name
                    FROM equipment AS eq
                    JOIN equipment_type as et 
                    ON et.e_id = eq.e_id
                    JOIN type AS t
                    ON t.type_id = et.type_id
                    WHERE eq.is_deleted = 0`;
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
        if (!data.e_id) {
            data.e_id = uuidv4().replace(/[^0-9]/g, '').slice(0, 8);
        }

        console.log(data);

        // เริ่ม transaction
        db.beginTransaction((err) => {
            if (err) return callback(err);
            const equipmentQuery = 'INSERT INTO equipment (e_id, name, status) VALUES (?, ?, ?)';
            const equipmentValues = [data.e_id, data.name, data.status];

            db.query(equipmentQuery, equipmentValues, (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        callback(err);
                    });
                }

                // ถ้าไม่มี type_id ให้ commit ทันที
                if (!data.type) {
                    return db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                callback(err);
                            });
                        }
                        callback(null, { data });
                    });
                }

                // INSERT ข้อมูลลง equipment_type
                let typeIds = Array.isArray(data.type) ? data.type : [data.type];
                // convert typeLds = ['1,2'] to typeIds = ['1','2']
                typeIds = typeIds.flatMap(id => id.split(',').map(s => s.trim()).filter(s => s !== ''));
                let completed = 0;
                let hasError = null;

                if (typeIds.length === 0) {
                    return db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                callback(err);
                            });
                        }
                        callback(null, { data });
                    });
                }

                typeIds.forEach(typeId => {
                    console.log('Inserting type_id:', typeId);
                    const typeQuery = 'INSERT INTO equipment_type (e_id, type_id) VALUES (?, ?)';
                    db.query(typeQuery, [data.e_id, typeId], (err, results) => {
                        if (err) {
                            hasError = err;
                        }

                        completed++;
                        if (completed === typeIds.length) {
                            if (hasError) {
                                return db.rollback(() => {
                                    callback(hasError);
                                });
                            }

                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        callback(err);
                                    });
                                }
                                callback(null, { data });
                            });
                        }
                    });
                });
            });
        });
    },
    update: (id, data, callback) => {
        const query = 'UPDATE equipment SET name = ?, status = ? WHERE e_id = ?'
        const values = [data.name, data.status, id]
        db.beginTransaction((err) => {
            if (err) return callback(err);
            db.query(query, values, (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        callback(err);
                    });
                }

                // ถ้าไม่มี type_id ให้ commit ทันที
                if (!data.type) {
                    return db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                callback(err);
                            });
                        }
                        callback(null, results);
                    });
                }

                // DELETE ข้อมูลเก่าใน equipment_type
                const equipment_typeQuery = 'UPDATE equipment_type SET type_id = ? WHERE e_id = ?';
                db.query(equipment_typeQuery, [data.type, id], (err, results) => {
                    if (err) {
                        return db.rollback(() => {
                            callback(err);
                        });
                    }
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                callback(err);
                            });
                        }
                        callback(null, results);
                    });
                });
            });
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
    },
    getLoanByUserId: (userId, callback) => {
        const query = `SELECT loan.*, equipment.name AS equipment_name, users.username AS user_name
                    FROM loan
                    JOIN equipment ON loan.e_id = equipment.e_id
                    JOIN users ON loan.user_id = users.user_id
                    WHERE loan.user_id = ?`;
        db.query(query, [userId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getLoanByEquipmentId: (eId, callback) => {
        const query = `SELECT loan.*, equipment.name AS equipment_name, users.username AS user_name
                    FROM loan
                    JOIN equipment ON loan.e_id = equipment.e_id
                    JOIN users ON loan.user_id = users.user_id
                    WHERE loan.e_id = ?`;
        db.query(query, [eId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
}
module.exports = Equipment;