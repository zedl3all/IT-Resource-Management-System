const db = require('../config/db');

class UpdateStatusService {
    static async updateRoomStatus() {
        // Example logic to update room status based on certain conditions
        try {
            const currentTime = new Date();
            
            // อัพเดทห้องที่การจองหมดเวลาแล้ว (จาก occupied กลับไปเป็น available)
            // แต่ไม่ยุ่งกับห้องที่อยู่ในสถานะ maintenance (status = -1)
            const [expiredBookings] = await db.promise().query(`
                SELECT DISTINCT r.room_id as room_id 
                FROM booking b 
                JOIN rooms r ON b.room_id = r.room_id 
                WHERE r.status = 0 
                AND b.end_time <= ? 
                AND r.status != -1
            `, [currentTime]);
            
            if (expiredBookings.length > 0) {
                const roomIds = expiredBookings.map(row => row.room_id);
                // เปลี่ยนสถานะห้องกลับเป็น available (status = 1)
                await db.promise().query('UPDATE rooms SET status = 1 WHERE room_id IN (?)', [roomIds]);
                console.log(`Updated ${roomIds.length} rooms back to available status`);
            }
            
            // อัพเดทห้องที่กำลังมีการจองที่เริ่มแล้ว (จาก available ไปเป็น occupied)
            // แต่ไม่ยุ่งกับห้องที่อยู่ในสถานะ maintenance (status = -1)
            const [activeBookings] = await db.promise().query(`
                SELECT DISTINCT r.room_id as room_id 
                FROM booking b 
                JOIN rooms r ON b.room_id = r.room_id 
                WHERE r.status = 1 
                AND b.start_time <= ? 
                AND b.end_time > ? 
                AND r.status != -1
            `, [currentTime, currentTime]);
            
            if (activeBookings.length > 0) {
                const roomIds = activeBookings.map(row => row.room_id);
                // เปลี่ยนสถานะห้องเป็น occupied (status = 0)
                await db.promise().query('UPDATE rooms SET status = 0 WHERE room_id IN (?)', [roomIds]);
                console.log(`Updated ${roomIds.length} rooms to occupied status`);
            }
            
        }
        catch(error) {
            console.error('Error updating room status:', error);
        }
    }

    static async UpdateEquipmentStatus() {
        try {
            const currentTime = new Date();
            // ? equipment status: 1 = available, 0 = in-use, -1 = maintenance

            // หาก loan มีสถานะ 1 (คืนแล้ว) และอุปกรณ์ยังไม่ available
            const [returnedLoans] = await db.promise().query(`
                SELECT DISTINCT e.e_id as e_id
                FROM loan l
                JOIN equipment e ON l.e_id = e.e_id
                WHERE l.status = 1
                AND e.status != 1
                AND e.status != -1
            `);
            
            if (returnedLoans.length > 0) {
                const equipmentIds = returnedLoans.map(row => row.e_id);
                const result = await db.promise().query('UPDATE equipment SET status = 1 WHERE e_id IN (?)', [equipmentIds]);
                
                // Only log if rows were actually updated
                if (result[0].affectedRows > 0) {
                    console.log(`Updated ${result[0].affectedRows} equipment back to available status`);
                    console.log('Equipment IDs:', equipmentIds);
                }
            }
            
            // หาก loan มีสถานะ 0 (ยังไม่คืน) และอุปกรณ์ยังไม่ถูกตั้งเป็น in-use
            const [activeLoans] = await db.promise().query(`
                SELECT DISTINCT e.e_id as e_id
                FROM loan l
                JOIN equipment e ON l.e_id = e.e_id
                WHERE l.status = 0
                AND e.status != 0
                AND e.status != -1
            `);
            
            if (activeLoans.length > 0) {
                const equipmentIds = activeLoans.map(row => row.e_id);
                const result = await db.promise().query('UPDATE equipment SET status = 0 WHERE e_id IN (?)', [equipmentIds]);
                
                // Only log if rows were actually updated
                if (result[0].affectedRows > 0) {
                    console.log(`Updated ${result[0].affectedRows} equipment to in-use status`);
                    console.log('Equipment IDs:', equipmentIds);
                }
            }
        }
        catch(error) {
            console.error('Error updating equipment status:', error);
        }
    }

    static startAutoUpdate(intervalMinutes = 5) {
        // Run once immediately on startup
        this.updateRoomStatus();
        this.UpdateEquipmentStatus();
        
        // Then set interval for future updates
        setInterval(() => {
            this.updateRoomStatus();
            this.UpdateEquipmentStatus();
        }, intervalMinutes * 60 * 1000);
        
        console.log(`Auto-update service started. Running every ${intervalMinutes} minutes.`);
    }
}

module.exports = UpdateStatusService;