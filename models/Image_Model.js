const fs = require('fs');
const path = require('path');
const { s3, bucket } = require('../config/s3');
const { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

class ImageModel {
  constructor() {}

  /**
   * ตรวจสอบว่ารูปภาพมีอยู่หรือไม่
   * รองรับทั้ง local path และ S3 URL
   */
  async imageExists(imagePath) {
    try {
      // ตรวจสอบว่าเป็น URL เต็มหรือไม่
      if (imagePath.startsWith('http')) {
        // ถ้าเป็น URL ให้ตรวจสอบว่าเป็น S3 URL หรือไม่
        if (imagePath.includes(bucket)) {
          // แยก key จาก URL
          const urlParts = new URL(imagePath);
          const key = urlParts.pathname.substring(1); // ตัด / ข้างหน้าออก
          
          // ตรวจสอบกับ S3
          await s3.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: key
          }));
          return true;
        }
        // ถ้าเป็น URL อื่นๆ ให้ถือว่ามีอยู่
        return true;
      }
      
      // ถ้าเป็น local path
      const localPath = imagePath.startsWith('./') ? imagePath : `./${imagePath}`;
      
      // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
      if (fs.existsSync(localPath)) {
        return true;
      }
      
      // ถ้าไม่ใช่ทั้งสองกรณี ให้ลองตรวจสอบกับ S3
      // สร้าง key ตามรูปแบบ image/maintenance/...
      const key = imagePath.startsWith('image/') ? imagePath : `image/${imagePath}`;
      
      await s3.send(new HeadObjectCommand({
        Bucket: bucket,
        Key: key
      }));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * ดึงไฟล์รูปภาพจาก local หรือ S3
   */
  async getImageObject(imagePath) {
    // ตรวจสอบว่าเป็น URL เต็มหรือไม่
    if (imagePath.startsWith('http')) {
      // ถ้าเป็น S3 URL
      if (imagePath.includes(bucket)) {
        const urlParts = new URL(imagePath);
        const key = urlParts.pathname.substring(1);
        
        return s3.send(new GetObjectCommand({
          Bucket: bucket,
          Key: key
        }));
      }
      
      // ถ้าเป็น URL อื่นๆ ให้ redirect
      return { 
        type: 'redirect',
        url: imagePath
      };
    }
    
    // ถ้าเป็น local path
    const localPath = imagePath.startsWith('./') ? imagePath : `./${imagePath}`;
    if (fs.existsSync(localPath)) {
      return {
        ContentType: this.getContentType(localPath),
        Body: fs.createReadStream(localPath)
      };
    }
    
    // ถ้าไม่ใช่ทั้งสองกรณี ให้ลองดึงจาก S3
    const key = imagePath.startsWith('image/') ? imagePath : `image/${imagePath}`;
    return s3.send(new GetObjectCommand({
      Bucket: bucket,
      Key: key
    }));
  }

  /**
   * แสดงรายการรูปภาพทั้งหมดในไดเรกทอรี
   */
  async listImages(directory = 'image/maintenance/') {
    try {
      // รายการไฟล์จาก S3
      const s3Response = await s3.send(new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: directory
      }));
      
      const s3Images = s3Response.Contents?.map(item => item.Key) || [];
      
      // รายการไฟล์จาก local
      let localImages = [];
      const localDir = directory.replace('image/', '');
      const fullLocalPath = path.join('./Images', localDir);
      
      if (fs.existsSync(fullLocalPath)) {
        const files = fs.readdirSync(fullLocalPath);
        localImages = files.map(file => path.join('Images', localDir, file));
      }
      
      // รวมรายการไฟล์ทั้งหมด
      return [...new Set([...s3Images, ...localImages])];
    } catch (error) {
      console.error('Error listing images:', error);
      return [];
    }
  }

  /**
   * ตรวจสอบ Content Type ของไฟล์
   */
  getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    return types[ext] || 'application/octet-stream';
  }
}

module.exports = new ImageModel();