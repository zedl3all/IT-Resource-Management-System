const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

// ตรวจสอบว่ามีการกำหนดค่าที่จำเป็นทั้งหมดใน .env
if (!process.env.AWS_REGION || !process.env.S3_BUCKET_NAME) {
  console.error('AWS_REGION และ S3_BUCKET_NAME จำเป็นต้องกำหนดในไฟล์ .env');
  process.exit(1);
}

// สร้าง S3 client instance
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN // ถ้ามี
  }
});

const bucket = process.env.S3_BUCKET_NAME;

module.exports = { s3, bucket };