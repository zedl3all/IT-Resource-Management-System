const Maintenance = require('../models/Maintenance_Model');
const upload = require('../middleware/Upload_Middleware');
const path = require('path');
const { s3, bucket } = require('../config/s3');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

const handleUpload = upload.single('image');

const MaintenanceController = {
    getAllMaintenances: (req, res) => {
        Maintenance.getAll((err, Maintenances) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ Maintenances });
        });
    },
    getMaintenanceById: (req, res) => {
        const MaintenanceId = req.params.id;
        Maintenance.getById(MaintenanceId, (err, Maintenance) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            if (!Maintenance) return res.status(404).json({
                error: 'Maintenance not found',
                details: `No Maintenance found with ID ${MaintenanceId}`
            });
            res.json(Maintenance);
        });
    },
    searchMaintenances: (req, res) => {
        const keyword = req.query.keyword;
        Maintenance.searchByKeyword(keyword, (err, Maintenances) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.json(Maintenances);
        });
    },
    createMaintenance: (req, res) => {
        handleUpload(req, res, async function(err) {
            if (err) {
                return res.status(400).json({
                    error: 'File upload error',
                    details: err.message
                });
            }
            
            // รับข้อมูลจาก request body
            const maintenanceData = req.body;
            
            // อัพโหลดไฟล์ไปยัง S3 ถ้ามีไฟล์
            if (req.file) {
                try {
                    // กำหนดนามสกุลไฟล์
                    const ext = path.extname(req.file.originalname) || '.jpg';
                    // สร้าง key สำหรับ S3 เพื่อเก็บในโฟลเดอร์ image/maintenance
                    const key = `image/maintenance/maintenance-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
                    
                    // อัพโหลดไฟล์ไปยัง S3
                    await s3.send(new PutObjectCommand({
                        Bucket: bucket,
                        Key: key,
                        Body: req.file.buffer,
                        ContentType: req.file.mimetype,
                        ACL: 'public-read' // ให้ไฟล์เป็น public เพื่อให้เข้าถึงได้โดยตรงผ่าน URL
                    }));
                    
                    // เก็บ URL เต็มแทนที่จะเก็บเพียง path
                    maintenanceData.image = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
                } catch (e) {
                    return res.status(500).json({
                        error: 'S3 upload error',
                        details: e.message
                    });
                }
            }
            
            // ตั้งค่าเริ่มต้น
            maintenanceData.DT_report = maintenanceData.DT_report || new Date().toISOString();
            maintenanceData.status = maintenanceData.status ?? 0; // 0 = รอดำเนินการ

            // บันทึกข้อมูล
            Maintenance.create(maintenanceData, (dbErr, result) => {
                if (dbErr) {
                    return res.status(500).json({
                        error: 'Database error',
                        details: dbErr.message
                    });
                }
                
                // ส่งข้อมูลผ่าน Socket.IO ถ้ามีการตั้งค่าไว้
                const io = req.app.get('io');
                if (io) io.emit('maintenances:changed', { action: 'create', id: result.request_id });
                
                return res.status(201).json({
                    message: 'สร้างรายการแจ้งซ่อมสำเร็จ',
                    maintenanceId: result.request_id,
                    image: maintenanceData.image || null
                });
            });
        });
    },
    updateMaintenance: (req, res) => {
        const MaintenanceId = req.params.id;
        const MaintenanceData = req.body;
        Maintenance.update(MaintenanceId, MaintenanceData, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'update', id: MaintenanceId });
            // --- emit to clients ---
            res.json({
                message: 'Maintenance updated successfully',
                details: results
            });
        });
    },
    softDeleteMaintenance: (req, res) => {
        const MaintenanceId = req.params.id;
        Maintenance.soft_delete(MaintenanceId, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'soft_delete', id: MaintenanceId });
            // --- emit to clients ---
            res.json({
                message: 'Maintenance soft deleted successfully',
                details: results
            });
        });
    },
    restoreMaintenance: (req, res) => {
        const MaintenanceId = req.params.id;
        Maintenance.restore(MaintenanceId, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'restore', id: MaintenanceId });
            // --- emit to clients ---
            res.json({
                message: 'Maintenance restored successfully',
                details: results
            });
        });
    },
    getMaintenancesByUserId: (req, res) => {
        const userId = req.params.userId;
        Maintenance.getByUserId(userId, (err, maintenances) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            res.status(200).json({ maintenances });
        });
    },
    updateStaffAndStatus: (req, res) => {
        const MaintenanceId = req.params.id;
        const { staff_id, status } = req.body;
        Maintenance.updateStaffAndStatus(MaintenanceId, staff_id, status, (err, results) => {
            if (err) return res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
            // +++ emit to clients +++
            const io = req.app.get('io');
            if (io) io.emit('maintenances:changed', { action: 'update', id: MaintenanceId });
            // --- emit to clients ---
            res.json({
                message: 'Maintenance staff and status updated successfully',
                details: results
            });
        });
    }
};

module.exports = MaintenanceController;