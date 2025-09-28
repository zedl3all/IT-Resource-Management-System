const db = require('../config/db');

class UpdateStatusService {
    // +++ keep a reference to io +++
    static io = null;
    // --- keep a reference to io ---

    static async updateRoomStatus() {
        try {
            const currentTime = new Date();

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
                const [result] = await db.promise().query('UPDATE rooms SET status = 1 WHERE room_id IN (?)', [roomIds]);
                if (result.affectedRows > 0) {
                    console.log(`Updated ${result.affectedRows} rooms back to available status`);
                    if (this.io) this.io.emit('rooms:status-updated', { ids: roomIds, status: 1 });
                }
            }

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
                const [result] = await db.promise().query('UPDATE rooms SET status = 0 WHERE room_id IN (?)', [roomIds]);
                if (result.affectedRows > 0) {
                    console.log(`Updated ${result.affectedRows} rooms to occupied status`);
                    if (this.io) this.io.emit('rooms:status-updated', { ids: roomIds, status: 0 });
                }
            }
        }
        catch(error) {
            console.error('Error updating room status:', error);
        }
    }

    static async updateEquipmentStatus() {
        try {
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
                const [result] = await db.promise().query('UPDATE equipment SET status = 1 WHERE e_id IN (?)', [equipmentIds]);
                if (result.affectedRows > 0) {
                    console.log(`Updated ${result.affectedRows} equipment back to available status`);
                    if (this.io) this.io.emit('equipments:status-updated', { ids: equipmentIds, status: 1 });
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
                const [result] = await db.promise().query('UPDATE equipment SET status = 0 WHERE e_id IN (?)', [equipmentIds]);
                if (result.affectedRows > 0) {
                    console.log(`Updated ${result.affectedRows} equipment to in-use status`);
                    if (this.io) this.io.emit('equipments:status-updated', { ids: equipmentIds, status: 0 });
                }
            }
        } catch (error) {
            console.error('Error updating equipment status:', error);
        }
    }

    // Backward-compatible alias (keeps existing callers working)
    static async UpdateEquipmentStatus() {
        return this.updateEquipmentStatus();
    }

    static startAutoUpdate(io, intervalMinutes = 5) {
        this.io = io;

        // Run once immediately on startup
        this.updateRoomStatus();
        this.updateEquipmentStatus();

        // Then set interval for future updates
        setInterval(() => {
            this.updateRoomStatus();
            this.updateEquipmentStatus();
        }, intervalMinutes * 60 * 1000);

        console.log(`Auto-update service started. Running every ${intervalMinutes} minutes.`);
    }
}

module.exports = UpdateStatusService;