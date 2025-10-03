const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Room = {
    getAll: (callback) => {
        const query = "SELECT * FROM rooms WHERE is_deleted = 0";
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        const query = "SELECT * FROM rooms WHERE room_id = ? AND is_deleted = 0";
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },
    searchByKeyword: (keyword, callback) => {
        const query =
            "SELECT * FROM rooms WHERE room_name LIKE ? AND is_deleted = 0";
        db.query(query, [`%${keyword}%`], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    // Add more CRUD operations as needed
    create: (roomData, callback) => {
        if (!roomData.id) {
            // random only numbers user uuidv4 and take only numbers
            roomData.id = uuidv4()
                .replace(/[^0-9]/g, "")
                .slice(0, 8);
        }
        const query =
            "INSERT INTO rooms (room_id, room_name, description, capacity, status) VALUES (?, ?, ?, ?, ?)";
        const values = [
            roomData.id,
            roomData.name,
            roomData.description,
            roomData.capacity,
            roomData.status,
        ];
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, roomData);
        });
    },
    update: (id, roomData, callback) => {
        const query =
            "UPDATE rooms SET room_name = ?, description = ?, capacity = ?, status = ? WHERE room_id = ? AND is_deleted = 0";
        const values = [
            roomData.name,
            roomData.description,
            roomData.capacity,
            roomData.status,
            id,
        ];
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    soft_delete: (id, callback) => {
        const query = "UPDATE rooms SET is_deleted = 1 WHERE room_id = ?";
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    restore: (id, callback) => {
        const query = "UPDATE rooms SET is_deleted = 0 WHERE room_id = ?";
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getBookingsByRoomId: (id, callback) => {
        const query =
            "SELECT start_time, end_time, users.username, purpose FROM booking JOIN users ON booking.user_id = users.user_id WHERE room_id = ?";
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
    },
    getBookingByUserId: (user_id, callback) => {
        const query = `
        SELECT booking.*, rooms.room_name, rooms.description, rooms.status, rooms.capacity
        FROM booking
        JOIN rooms ON booking.room_id = rooms.room_id
        WHERE booking.user_id = ? AND rooms.is_deleted = 0
        `;
        db.query(query, [user_id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    createBooking: (bookingData, callback) => {
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!bookingData.room_id || !bookingData.user_id || !bookingData.start_time || !bookingData.end_time) {
            return callback(new Error('ข้อมูลไม่ครบถ้วน กรุณาระบุ room_id, user_id, start_time, end_time'));
        }

        // 1. ตรวจสอบว่าห้องว่างในช่วงเวลาที่ต้องการหรือไม่
        const checkAvailabilityQuery = `
            SELECT COUNT(*) AS conflict_count
            FROM booking
            WHERE room_id = ?
            AND (
                (? BETWEEN start_time AND end_time) OR
                (? BETWEEN start_time AND end_time) OR
                (start_time BETWEEN ? AND ?) OR
                (end_time BETWEEN ? AND ?)
            )
        `;
        
        const checkParams = [
            bookingData.room_id,
            bookingData.start_time, // เช็คเวลาเริ่มอยู่ในช่วงการจองเดิมหรือไม่
            bookingData.end_time,   // เช็คเวลาจบอยู่ในช่วงการจองเดิมหรือไม่
            bookingData.start_time, bookingData.end_time, // เช็คช่วงเวลาการจองใหม่ครอบคลุมการจองเดิมหรือไม่
            bookingData.start_time, bookingData.end_time  // เช็คช่วงเวลาการจองใหม่ครอบคลุมการจองเดิมหรือไม่
        ];

        db.query(checkAvailabilityQuery, checkParams, (err, results) => {
            if (err) return callback(err);
            if (results[0].conflict_count > 0) {
                return callback(new Error('ห้องไม่ว่างในช่วงเวลาที่เลือก'));
            }

            console.log("Q1 Success");
            // 2. ตรวจสอบสถานะห้อง
            const checkRoomStatusQuery = `
                SELECT status FROM rooms WHERE room_id = ? AND is_deleted = 0
            `;
            
            db.query(checkRoomStatusQuery, [bookingData.room_id], (err, roomResults) => {
                if (err) return callback(err);
                
                if (roomResults.length === 0) {
                    return callback(new Error('ไม่พบข้อมูลห้อง'));
                }
                
                if (parseInt(roomResults[0].status) !== 1) {
                    return callback(new Error('ห้องไม่อยู่ในสถานะพร้อมใช้งาน'));
                }
                
                console.log("Q2 Success");
                // 3. สร้าง booking ID ด้วย UUID
                const booking_id = uuidv4();
                
                // 4. เพิ่มข้อมูลการจองลงในฐานข้อมูล
                const insertBookingQuery = `
                    INSERT INTO booking (room_id, user_id, start_time, end_time, purpose)
                    VALUES (?, ?, ?, ?, ?)
                `;
                
                const insertBookingParams = [
                    bookingData.room_id,
                    bookingData.user_id,
                    bookingData.start_time,
                    bookingData.end_time,
                    bookingData.purpose || 'ไม่ระบุวัตถุประสงค์'
                ];
                
                db.query(insertBookingQuery, insertBookingParams, (err, insertResult) => {
                    if (err) return callback(err);
                    
                    console.log("Q3 Success");
                    // 5. อัปเดตสถานะห้องเป็น "ถูกจอง" (0) หากการจองเริ่มขึ้นทันที
                    const now = new Date();
                    const startTime = new Date(bookingData.start_time);
                    const endTime = new Date(bookingData.end_time);
                    
                    // ถ้าเวลาปัจจุบันอยู่ในช่วงการจอง ให้อัปเดตสถานะห้องเป็น "ถูกจอง"
                    if (now >= startTime && now <= endTime) {
                        const updateRoomStatusQuery = `
                            UPDATE rooms SET status = 0 WHERE room_id = ?
                        `;
                        
                        db.query(updateRoomStatusQuery, [bookingData.room_id], (err) => {
                            if (err) {
                                console.error('ไม่สามารถอัปเดตสถานะห้องได้:', err);
                                // ไม่ให้ error นี้หยุดการทำงานของฟังก์ชัน เนื่องจากการจองสำเร็จแล้ว
                            }
                            callback(null, {
                                booking_id,
                                ...bookingData,
                                status: 'success'
                            });
                        });
                    } else {
                        callback(null, {
                            booking_id,
                            ...bookingData,
                            status: 'success'
                        });
                    }
                });
            });
        });
    },

    cancelBooking: (bookingId, callback) => {
        // 1. ตรวจสอบว่าการจองมีอยู่จริงหรือไม่
        const checkBookingQuery = `
            SELECT * FROM booking WHERE booking_id = ?
        `;
        
        db.query(checkBookingQuery, [bookingId], (err, bookings) => {
            if (err) return callback(err);
            
            if (bookings.length === 0) {
                return callback(new Error('ไม่พบข้อมูลการจอง'));
            }
            
            const booking = bookings[0];
            
            // 2. อัปเดตสถานะการจองเป็น "ยกเลิก" (0)
            const cancelBookingQuery = `
                DELETE FROM booking WHERE booking_id = ?
            `;
            
            db.query(cancelBookingQuery, [bookingId], (err, result) => {
                if (err) return callback(err);
                
                // 3. ตรวจสอบว่าการจองนี้กำลังอยู่ในช่วงเวลาปัจจุบันหรือไม่
                const now = new Date();
                const startTime = new Date(booking.start_time);
                const endTime = new Date(booking.end_time);
                
                // ถ้าการจองอยู่ในช่วงเวลาปัจจุบัน ให้อัปเดตห้องเป็น "ว่าง" (1)
                if (now >= startTime && now <= endTime) {
                    const updateRoomStatusQuery = `
                        UPDATE rooms SET status = 1 WHERE room_id = ?
                    `;
                    
                    db.query(updateRoomStatusQuery, [booking.room_id], (err) => {
                        if (err) {
                            console.error('ไม่สามารถอัปเดตสถานะห้องได้:', err);
                            // ไม่ให้ error นี้หยุดการทำงานของฟังก์ชัน เนื่องจากการยกเลิกสำเร็จแล้ว
                        }
                        
                        callback(null, {
                            booking_id: bookingId,
                            status: 'cancelled'
                        });
                    });
                } else {
                    callback(null, {
                        booking_id: bookingId,
                        status: 'cancelled'
                    });
                }
            });
        });
    },

    checkRoomAvailability: (roomId, startTime, endTime, callback) => {
        // ตรวจสอบว่าห้องว่างในช่วงเวลาที่ระบุหรือไม่
        const query = `
            SELECT COUNT(*) AS conflict_count
            FROM booking
            WHERE room_id = ?
            AND status = 1
            AND (
                (? BETWEEN start_time AND end_time) OR
                (? BETWEEN start_time AND end_time) OR
                (start_time BETWEEN ? AND ?) OR
                (end_time BETWEEN ? AND ?)
            )
        `;
        
        const params = [
            roomId,
            startTime,
            endTime,
            startTime, endTime,
            startTime, endTime
        ];
        
        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            
            // ถ้า conflict_count > 0 แสดงว่าห้องไม่ว่าง
            const isAvailable = results[0].conflict_count === 0;
            
            callback(null, {
                roomId,
                startTime,
                endTime,
                isAvailable
            });
        });
    }
};
module.exports = Room;
