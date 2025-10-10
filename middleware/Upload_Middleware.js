const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Change the upload directory to Images/maintenance
const uploadDir = 'Images/maintenance';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// เปลี่ยนจาก diskStorage เป็น memoryStorage เพื่ออัปโหลดขึ้น S3
const storage = multer.memoryStorage();

// File filter to only accept images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
};

// Create the multer instance with configuration
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;