const multer = require('multer');
const path = require('path');

// ใช้ memory storage เพื่อเก็บไฟล์ในหน่วยความจำก่อนอัพโหลดไปยัง S3
const storage = multer.memoryStorage();

// File filter เพื่อให้รับเฉพาะไฟล์รูปภาพ
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('อนุญาตให้อัพโหลดเฉพาะไฟล์รูปภาพเท่านั้น!'), false);
  }
};

// สร้าง multer instance พร้อมการตั้งค่า
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // จำกัดขนาดไฟล์ที่ 5MB
  }
});

module.exports = upload;