# Changelog - AWS S3 Integration

## เปลี่ยนแปลงวันที่ 10 ตุลาคม 2025

### 🎯 วัตถุประสงค์
เพิ่มการรองรับ AWS S3 สำหรับการจัดเก็บรูปภาพแจ้งซ่อม เพื่อให้สามารถเข้าถึงรูปภาพผ่าน public URL และลดภาระการจัดเก็บในเซิร์ฟเวอร์

### ✨ Features ใหม่

#### 1. AWS S3 Integration
- ✅ เชื่อมต่อกับ AWS S3 bucket: `itrms-uploads-bucket-2025`
- ✅ อัปโหลดรูปภาพไปยัง S3 แทนการเก็บในเซิร์ฟเวอร์
- ✅ สร้าง public URL สำหรับเข้าถึงรูปภาพ
- ✅ รองรับทั้ง S3 URL และ local storage path

#### 2. Image Storage Structure
```
S3 Bucket: itrms-uploads-bucket-2025
└── image/
    └── maintenance/
        ├── 1728567890-123456789.jpg
        ├── 1728567891-987654321.png
        └── ...
```

#### 3. URL Format
รูปภาพสามารถเข้าถึงได้ผ่าน:
```
https://itrms-uploads-bucket-2025.s3.us-east-1.amazonaws.com/image/maintenance/<filename>
```

### 📝 ไฟล์ที่แก้ไข

#### Backend Files

1. **`config/s3.js`** (ไม่มีการเปลี่ยนแปลง)
   - ใช้ AWS SDK v3
   - ตั้งค่า S3 Client ด้วย credentials จาก environment variables

2. **`controllers/Maintenance_Controller.js`**
   ```javascript
   // เปลี่ยนจาก
   const key = `maintenance/${filename}`;
   
   // เป็น
   const key = `image/maintenance/${timestamp}-${random}${ext}`;
   maintenanceData.image = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
   ```
   - เพิ่ม path prefix `image/`
   - สร้าง full S3 URL แทน relative path
   - เพิ่ม logging สำหรับ debug
   - ตั้งค่า `ACL: 'public-read'` สำหรับ public access

3. **`controllers/Image_Controller.js`**
   ```javascript
   // เพิ่มการตรวจสอบ URL
   if (imagePath.startsWith('https://') || imagePath.startsWith('http://')) {
       return res.redirect(imagePath);
   }
   ```
   - รองรับการ redirect ไปยัง S3 URL
   - เพิ่ม prefix `image/` สำหรับ local paths
   - ยังคงรองรับ local storage สำหรับ backward compatibility

4. **`models/Image_Model.js`** (ไม่มีการเปลี่ยนแปลง)
   - ใช้ prefix `image/` สำหรับ S3 operations
   - รองรับ HeadObject, GetObject, และ ListObjects

5. **`models/Maintenance_Model.js`** (ไม่มีการเปลี่ยนแปลง)
   - เก็บ full URL ในฐานข้อมูล
   - ไม่เพิ่ม prefix `./` หน้า URL

#### Frontend Files

6. **`public/js/user.js`**
   ```javascript
   // เพิ่มการตรวจสอบ URL
   if (trimmedImg.startsWith('https://') || trimmedImg.startsWith('http://')) {
       return trimmedImg;  // ใช้ S3 URL โดยตรง
   }
   return `/api/images?path=${encodeURIComponent(path)}`;  // ใช้ API สำหรับ local
   ```
   - รองรับทั้ง S3 URL และ local path
   - ใช้ `encodeURIComponent()` เพื่อความปลอดภัย

7. **`public/js/staff.js`**
   - เหมือนกับ user.js
   - รองรับทั้ง S3 URL และ local path

#### Configuration Files

8. **`.env`**
   ```env
   # AWS S3 Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   S3_BUCKET_NAME=itrms-uploads-bucket-2025
   ```
   - อัปเดต bucket name เป็น `itrms-uploads-bucket-2025`

#### Documentation Files

9. **`docs/AWS_S3_SETUP.md`** (ใหม่)
   - คู่มือการตั้งค่า AWS S3 แบบละเอียด
   - Bucket Policy และ CORS Configuration
   - IAM User Setup และ Permissions
   - Troubleshooting Guide
   - Security Best Practices

10. **`test-s3-connection.js`** (ใหม่)
    - Script สำหรับทดสอบการเชื่อมต่อ S3
    - ทดสอบ List Buckets, List Objects, และ Upload
    - แสดงผลแบบสีสันสวยงาม
    - ใช้คำสั่ง: `node test-s3-connection.js`

11. **`README.md`**
    - เพิ่มข้อมูล AWS S3 ใน Technology Stack
    - เพิ่มขั้นตอนการตั้งค่า S3 ใน Installation
    - เพิ่ม link ไปยัง AWS S3 Setup Guide
    - อัปเดต Maintenance Management features

12. **`CHANGELOG_S3.md`** (ไฟล์นี้)
    - บันทึกการเปลี่ยนแปลงทั้งหมด

### 🔧 AWS S3 Configuration

#### Bucket Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadWriteAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::itrms-uploads-bucket-2025/*"
        }
    ]
}
```

#### CORS Policy
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"]
    }
]
```

#### IAM Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::itrms-uploads-bucket-2025/*"
        },
        {
            "Effect": "Allow",
            "Action": ["s3:ListBucket"],
            "Resource": "arn:aws:s3:::itrms-uploads-bucket-2025"
        }
    ]
}
```

### 🔄 Migration Process

#### สำหรับรูปภาพเดิมที่เก็บใน Local Storage
1. รูปภาพเดิมยังคงทำงานได้ผ่าน `/api/images` endpoint
2. รูปภาพใหม่จะถูกอัปโหลดไปยัง S3 โดยอัตโนมัติ
3. ระบบรองรับทั้งสองรูปแบบพร้อมกัน (backward compatible)

#### การ Migrate รูปภาพเดิมไปยัง S3 (Optional)
สามารถสร้าง script เพื่อ migrate รูปภาพเดิมได้:
```javascript
// สแกนไฟล์ใน Images/maintenance/
// อัปโหลดไปยัง S3
// อัปเดต URL ในฐานข้อมูล
```

### ✅ Testing Checklist

#### Manual Testing
- [x] ทดสอบอัปโหลดรูปภาพใหม่
- [x] ตรวจสอบว่ารูปถูกอัปโหลดไปยัง S3
- [x] ทดสอบการแสดงรูปภาพจาก S3 URL
- [x] ทดสอบ Image Viewer
- [x] ทดสอบการแสดงรูปภาพเดิม (local storage)
- [x] ทดสอบ public access ผ่าน direct URL

#### S3 Connection Test
```bash
node test-s3-connection.js
```

Expected output:
```
✓ Successfully connected to AWS S3
✓ Found target bucket "itrms-uploads-bucket-2025"
✓ Successfully uploaded test file
✓ All tests passed!
```

### 🔒 Security Considerations

#### ข้อดี
- ✅ รูปภาพเก็บใน cloud storage ที่มั่นคง
- ✅ ลด load บนเซิร์ฟเวอร์
- ✅ เข้าถึงได้จากทุกที่ผ่าน HTTPS
- ✅ AWS S3 มี 99.999999999% durability

#### ข้อควรระวัง
- ⚠️ ค่าใช้จ่าย AWS S3 (แต่น้อยมาก)
- ⚠️ Public access - ใครก็เข้าถึง URL ได้
- ⚠️ ต้องตั้งค่า AWS credentials ให้ถูกต้อง
- ⚠️ ควร rotate access keys เป็นระยะ

#### Best Practices
1. ไม่ควร hardcode credentials ในโค้ด
2. ใช้ environment variables
3. จำกัดสิทธิ์ IAM user ให้เหมาะสม
4. เปิด CloudWatch monitoring
5. ตั้ง Lifecycle policy เพื่อลบไฟล์เก่า

### 📊 Performance Impact

#### Before (Local Storage)
- 📁 ไฟล์เก็บใน server disk
- 🔄 Load บนเซิร์ฟเวอร์สูง
- 💾 จำกัดด้วย disk space

#### After (S3 Cloud Storage)
- ☁️ ไฟล์เก็บบน AWS S3
- ⚡ ลด load บนเซิร์ฟเวอร์
- 📈 Scalable และ reliable
- 🌍 Global CDN (ถ้าเปิด CloudFront)

### 🐛 Known Issues & Solutions

#### Issue 1: ไม่สามารถอัปโหลดได้
**สาเหตุ:** AWS credentials ไม่ถูกต้อง
**วิธีแก้:** ตรวจสอบ `.env` file และ IAM permissions

#### Issue 2: รูปภาพแสดงผล 403 Forbidden
**สาเหตุ:** Bucket policy ไม่อนุญาต public access
**วิธีแก้:** ตั้งค่า Bucket Policy และปิด Block Public Access

#### Issue 3: รูปภาพเดิมไม่แสดงผล
**สาเหตุ:** ระบบยังรองรับ local storage
**วิธีแก้:** ตรวจสอบว่า `/api/images` endpoint ยังทำงาน

### 📈 Future Improvements

1. **Image Optimization**
   - Resize รูปภาพก่อนอัปโหลด
   - Convert เป็น WebP format
   - Generate thumbnails

2. **CDN Integration**
   - เปิดใช้ AWS CloudFront
   - Cache รูปภาพที่ edge locations
   - เร็วขึ้นสำหรับผู้ใช้ทั่วโลก

3. **Advanced Features**
   - Multiple image upload (batch)
   - Image compression
   - Watermark
   - EXIF data extraction

4. **Cost Optimization**
   - S3 Lifecycle policies
   - Archive เป็น Glacier หลัง 90 วัน
   - Delete หลัง 1 ปี

5. **Security Enhancement**
   - Pre-signed URLs แทน public access
   - Virus scanning ก่อนอัปโหลด
   - Image validation

### 📞 Support

หากพบปัญหาหรือต้องการความช่วยเหลือ:
- 📖 อ่าน: [AWS S3 Setup Guide](docs/AWS_S3_SETUP.md)
- 🧪 ทดสอบ: `node test-s3-connection.js`
- 🐛 รายงาน: [GitHub Issues](https://github.com/zedl3all/IT-Resource-Management-System/issues)
- 📧 Email: sanguanwongtanapat@gmail.com

### 🎉 Summary

การเปลี่ยนแปลงนี้ทำให้ระบบ:
- ✅ รองรับ cloud storage (AWS S3)
- ✅ Scalable และ reliable มากขึ้น
- ✅ ลด load บนเซิร์ฟเวอร์
- ✅ Backward compatible กับรูปภาพเดิม
- ✅ พร้อมสำหรับการขยายระบบในอนาคต

---
**Last Updated:** October 10, 2025  
**Version:** 1.1.0  
**Author:** zedl3all
