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

    static startAutoUpdate(intervalMinutes = 5) {
        setInterval(() => {
            this.updateRoomStatus();
        }, intervalMinutes * 60 * 1000);
        
        console.log(`Auto-update service started. Running every ${intervalMinutes} minutes.`);
    }
}

module.exports = UpdateStatusService;