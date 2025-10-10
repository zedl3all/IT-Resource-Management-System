require('dotenv').config();
const { s3, bucket } = require('./config/s3');
const { ListObjectsCommand } = require('@aws-sdk/client-s3');

async function testS3Connection() {
  try {
    console.log(`Testing connection to S3 bucket: ${bucket}`);
    const response = await s3.send(new ListObjectsCommand({
      Bucket: bucket,
      MaxKeys: 5
    }));
    
    console.log('Connection successful!');
    console.log('Objects in bucket:');
    if (response.Contents && response.Contents.length > 0) {
      response.Contents.forEach(item => {
        console.log(`- ${item.Key} (${formatBytes(item.Size)})`);
      });
    } else {
      console.log('No objects found in bucket');
    }
  } catch (error) {
    console.error('Error connecting to S3:', error);
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

testS3Connection();

// ## การทดสอบ:

// 1. รันไฟล์ทดสอบการเชื่อมต่อ: `node test-s3-connection.js`
// 2. ใช้ระบบอัพโหลดรูปผ่านฟอร์มแจ้งซ่อม
// 3. ตรวจสอบว่ารูปถูกอัพโหลดไปยัง S3 และสามารถดูได้ผ่าน URL ที่ให้มา

// การปรับปรุงนี้ทำให้ระบบของคุณสามารถ:
// - เก็บรูปภาพบน Amazon S3 แทนที่จะเก็บในเซิร์ฟเวอร์โดยตรง
// - รองรับทั้งรูปภาพเก่า (local) และรูปภาพใหม่ (S3)
// - เชื่อมต่อกับ S3 bucket ผ่าน URL ที่กำหนด// filepath: c:\Users\SA090164\Desktop\Code\IT-Resource-Management-System\test-s3-connection.js
// require('dotenv').config();
// const { s3, bucket } = require('./config/s3');
// const { ListObjectsCommand } = require('@aws-sdk/client-s3');

// async function testS3Connection() {
//   try {
//     console.log(`Testing connection to S3 bucket: ${bucket}`);
//     const response = await s3.send(new ListObjectsCommand({
//       Bucket: bucket,
//       MaxKeys: 5
//     }));
    
//     console.log('Connection successful!');
//     console.log('Objects in bucket:');
//     if (response.Contents && response.Contents.length > 0) {
//       response.Contents.forEach(item => {
//         console.log(`- ${item.Key} (${formatBytes(item.Size)})`);
//       });
//     } else {
//       console.log('No objects found in bucket');
//     }
//   } catch (error) {
//     console.error('Error connecting to S3:', error);
//   }
// }

// function formatBytes(bytes, decimals = 2) {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
// }

// testS3Connection();
// ```

// ## การทดสอบ:

// 1. รันไฟล์ทดสอบการเชื่อมต่อ: `node test-s3-connection.js`
// 2. ใช้ระบบอัพโหลดรูปผ่านฟอร์มแจ้งซ่อม
// 3. ตรวจสอบว่ารูปถูกอัพโหลดไปยัง S3 และสามารถดูได้ผ่าน URL ที่ให้มา

// การปรับปรุงนี้ทำให้ระบบของคุณสามารถ:
// - เก็บรูปภาพบน Amazon S3 แทนที่จะเก็บในเซิร์ฟเวอร์โดยตรง
// - รองรับทั้งรูปภาพเก่า (local) และรูปภาพใหม่ (S3)
// - เชื่อมต่อกับ S3 bucket ผ่าน URL ที่กำหนด