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
    createLoan: (data, callback) => {
        console.log('Creating loan with data:', data);
        
        // แปลงรูปแบบวันที่และเวลาให้เป็น datetime string
        const borrowDT = `${data.booking_date}T${data.booking_time}:00`;
        const returnDT = `${data.return_date}T${data.return_time}:00`;
        
        // 1. ตรวจสอบสถานะอุปกรณ์ว่าพร้อมให้ยืมหรือไม่
        const checkEquipmentQuery = `SELECT status FROM equipment WHERE e_id = ? AND is_deleted = 0`;
        db.query(checkEquipmentQuery, [data.equipment_id], (err, equipmentResults) => {
            if (err) return callback(err);
            if (equipmentResults.length === 0) {
                return callback(new Error('ไม่พบอุปกรณ์'));
            }
            if (parseInt(equipmentResults[0].status) !== 1) {
                return callback(new Error('อุปกรณ์ไม่พร้อมให้ยืม'));
            }

            // 2. ตรวจสอบว่าผู้ใช้ยืมอุปกรณ์ชิ้นนี้อยู่หรือไม่
            const checkQuery = `SELECT * FROM loan 
                                WHERE e_id = ? AND user_id = ? AND status = 1`;
            db.query(checkQuery, [data.equipment_id, data.user_id], (err, results) => {
                if (err) return callback(err);
                if (results.length > 0) {
                    // ถ้ามีการยืมอยู่แล้ว
                    return callback(new Error('คุณได้ยืมอุปกรณ์นี้อยู่แล้ว'));
                }

                // 3. ตรวจสอบว่าช่วงเวลาที่จะยืมซ้อนทับกับการยืมอื่นหรือไม่
                const checkTimeQuery = `
                    SELECT COUNT(*) AS conflict_count
                    FROM loan
                    WHERE e_id = ? AND status = 1
                    AND (
                        (? BETWEEN borrow_DT AND return_DT) OR
                        (? BETWEEN borrow_DT AND return_DT) OR
                        (borrow_DT BETWEEN ? AND ?) OR
                        (return_DT BETWEEN ? AND ?)
                    )
                `;
                db.query(checkTimeQuery, [
                    data.equipment_id, 
                    borrowDT, returnDT, 
                    borrowDT, returnDT,
                    borrowDT, returnDT
                ], (err, timeResults) => {
                    if (err) return callback(err);
                    if (timeResults[0].conflict_count > 0) {
                        return callback(new Error('อุปกรณ์ถูกจองในช่วงเวลาที่เลือกแล้ว'));
                    }

                    // 4. เริ่ม Transaction สำหรับการยืมและอัพเดทสถานะอุปกรณ์
                    db.beginTransaction((err) => {
                        if (err) return callback(err);

                        // 4.1 บันทึกการยืม
                        const query = `INSERT INTO loan (e_id, user_id, borrow_DT, return_DT, purpose, status) 
                                    VALUES (?, ?, ?, ?, ?, ?)`;
                        const values = [
                            data.equipment_id, 
                            data.user_id, 
                            borrowDT, 
                            returnDT, 
                            data.purpose || 'ไม่ระบุวัตถุประสงค์',
                            1  // แก้: 1 = ยืมอยู่ (active), 0 = คืนแล้ว (returned)
                        ];

                        db.query(query, values, (err, insertResults) => {
                            if (err) {
                                return db.rollback(() => {
                                    callback(err);
                            });
                        }

                            // 4.2 อัพเดทสถานะอุปกรณ์เป็น "ถูกยืม" (status = 0)
                            const updateEquipmentQuery = `UPDATE equipment SET status = 0 WHERE e_id = ?`;
                            db.query(updateEquipmentQuery, [data.equipment_id], (err, updateResults) => {
                                if (err) {
                                    return db.rollback(() => {
                                        callback(err);
                                    });
                                }

                                // 4.3 Commit Transaction
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            callback(err);
                                        });
                                    }
                                    callback(null, {
                                        id: insertResults.insertId,
                                        message: 'บันทึกการยืมสำเร็จ',
                                        data: {
                                            e_id: data.equipment_id,
                                            user_id: data.user_id,
                                            borrow_DT: borrowDT,
                                            return_DT: returnDT,
                                            purpose: data.purpose
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    returnLoan: (loanId, callback) => {
        console.log('Returning loan with ID:', loanId);
        // 1. ดึงข้อมูลการยืมเพื่อหาหมายเลขอุปกรณ์
        const getLoanQuery = `SELECT * FROM loan WHERE loan_id = ? AND status = 1`; // status = 1 = ยืมอยู่
        db.query(getLoanQuery, [loanId], (err, loanResults) => {
            if (err) return callback(err);
            if (loanResults.length === 0) {
                return callback(new Error('ไม่พบการยืมนี้ หรืออุปกรณ์ถูกคืนแล้ว'));
            }
            const eId = loanResults[0].e_id;
            // 2. เริ่ม Transaction สำหรับการคืนอุปกรณ์และอัพเดทสถานะอุปกรณ์
            db.beginTransaction((err) => {
                if (err) return callback(err);
                // 2.1 อัพเดทสถานะการยืมเป็น "คืนแล้ว" (status = 0)
                const updateLoanQuery = `UPDATE loan SET status = 0 WHERE loan_id = ?`;
                db.query(updateLoanQuery, [loanId], (err, updateLoanResults) => {
                    if (err) {
                        return db.rollback(() => {
                            callback(err);
                        });
                    }
                    // 2.2 อัพเดทสถานะอุปกรณ์เป็น "พร้อมให้ยืม" (status = 1)
                    const updateEquipmentQuery = `UPDATE equipment SET status = 1 WHERE e_id = ?`;
                    db.query(updateEquipmentQuery, [eId], (err, updateEquipmentResults) => {
                        if (err) {
                            return db.rollback(() => {
                                callback(err);
                            });
                        }
                        // 2.3 Commit Transaction
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    callback(err);
                                });
                            }
                            callback(null, {
                                message: 'คืนอุปกรณ์สำเร็จ',
                                data: {
                                    e_id: eId,
                                    loan_id: loanId
                                }
                            });
                        });
                    });
                });
            });
        });
    }
};
module.exports = Equipment;