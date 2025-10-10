# AWS S3 Configuration Guide

## Overview
ระบบนี้ใช้ AWS S3 สำหรับจัดเก็บรูปภาพแจ้งซ่อม (Maintenance Images) โดยรูปภาพจะถูกอัปโหลดไปยัง S3 bucket และเข้าถึงได้ผ่าน public URL

## S3 Bucket Setup

### 1. Bucket Information
- **Bucket Name**: `itrms-uploads-bucket-2025`
- **Region**: `us-east-1` (US East - N. Virginia)
- **Access**: Public read access สำหรับรูปภาพ

### 2. Bucket Policy
ตั้งค่า Bucket Policy เพื่ออนุญาตให้เข้าถึงรูปภาพได้แบบ public:

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

### 3. CORS Configuration
เพิ่ม CORS policy เพื่อให้ web application สามารถเข้าถึงรูปภาพได้:

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

### 4. Block Public Access Settings
ปรับการตั้งค่าดังนี้:
- ✅ Block public access to buckets and objects granted through new access control lists (ACLs): **OFF**
- ✅ Block public access to buckets and objects granted through any access control lists (ACLs): **OFF**
- ✅ Block public access to buckets and objects granted through new public bucket or access point policies: **OFF**
- ✅ Block public and cross-account access to buckets and objects through any public bucket or access point policies: **OFF**

## Environment Configuration

### .env File Setup
อัปเดตไฟล์ `.env` ด้วยข้อมูล AWS credentials:

```properties
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_secret_access_key>
S3_BUCKET_NAME=itrms-uploads-bucket-2025
```

### การรับ AWS Credentials
1. เข้าไปที่ AWS IAM Console
2. สร้าง IAM User สำหรับ application
3. แนบ Policy ดังนี้:

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
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::itrms-uploads-bucket-2025"
        }
    ]
}
```

4. สร้าง Access Key และนำมาใส่ในไฟล์ `.env`

## Image Storage Structure

รูปภาพจะถูกเก็บใน S3 ตามโครงสร้างนี้:

```
itrms-uploads-bucket-2025/
└── image/
    └── maintenance/
        ├── 1234567890-123456789.jpg
        ├── 1234567891-987654321.png
        └── ...
```

### URL Format
รูปภาพจะสามารถเข้าถึงได้ผ่าน URL รูปแบบนี้:
```
https://itrms-uploads-bucket-2025.s3.us-east-1.amazonaws.com/image/maintenance/<filename>
```

**ตัวอย่าง:**
```
https://itrms-uploads-bucket-2025.s3.us-east-1.amazonaws.com/image/maintenance/1728567890-123456789.jpg
```

## System Integration

### 1. Upload Process
เมื่อผู้ใช้แจ้งซ่อมและอัปโหลดรูปภาพ:
1. ไฟล์จะถูกอัปโหลดไปยัง S3 bucket
2. ระบบจะสร้าง public URL
3. URL จะถูกเก็บในฐานข้อมูล MySQL

### 2. Display Process
เมื่อผู้ใช้ดูรายการแจ้งซ่อม:
1. ระบบดึง URL จากฐานข้อมูล
2. ถ้าเป็น S3 URL (ขึ้นต้นด้วย `https://`) ใช้ URL โดยตรง
3. ถ้าเป็น path แบบเดิม ใช้ API endpoint `/api/images`

## Testing

### Test Upload
1. เข้าสู่ระบบในฐานะ User
2. ไปที่หน้า "แจ้งซ่อม"
3. กรอกข้อมูลและเลือกรูปภาพ
4. คลิก "แจ้งซ่อม"
5. ตรวจสอบว่ารูปภาพถูกอัปโหลดไปยัง S3 สำเร็จ

### Test Display
1. เข้าสู่ระบบในฐานะ Staff หรือ User
2. ไปที่หน้า "รายการแจ้งซ่อม"
3. คลิกปุ่มดูรูปภาพ (🖼️)
4. ตรวจสอบว่ารูปภาพแสดงผลได้ถูกต้อง

### Verify S3 Upload
1. เข้าไปที่ AWS S3 Console
2. เปิด bucket `itrms-uploads-bucket-2025`
3. ตรวจสอบโฟลเดอร์ `image/maintenance/`
4. ดูว่ามีไฟล์รูปภาพใหม่ถูกสร้างหรือไม่

### Test Public Access
ลองเข้าถึงรูปภาพโดยตรงผ่าน URL:
```
https://itrms-uploads-bucket-2025.s3.us-east-1.amazonaws.com/image/maintenance/<filename>
```

## Troubleshooting

### ปัญหา: ไม่สามารถอัปโหลดไฟล์ได้
**สาเหตุที่เป็นไปได้:**
- AWS credentials ไม่ถูกต้อง
- IAM user ไม่มีสิทธิ์ PutObject
- Bucket policy ไม่อนุญาต

**วิธีแก้:**
1. ตรวจสอบ AWS credentials ในไฟล์ `.env`
2. ตรวจสอบ IAM policy
3. ตรวจสอบ Bucket policy

### ปัญหา: ไม่สามารถดูรูปภาพได้
**สาเหตุที่เป็นไปได้:**
- Block Public Access เปิดอยู่
- Bucket policy ไม่อนุญาตให้ GetObject
- CORS configuration ไม่ถูกต้อง

**วิธีแก้:**
1. ปิด Block Public Access
2. เพิ่ม `s3:GetObject` ใน Bucket policy
3. ตั้งค่า CORS ตามที่แนะนำ

### ปัญหา: รูปภาพแสดงผล 403 Forbidden
**สาเหตุที่เป็นไปได้:**
- ACL ไม่ถูกตั้งเป็น `public-read`
- Bucket policy ไม่อนุญาตให้ public access

**วิธีแก้:**
1. ตรวจสอบว่าโค้ดมีการตั้ง `ACL: 'public-read'`
2. ตรวจสอบ Bucket policy อีกครั้ง

## Security Considerations

### การป้องกัน
1. **ใช้ IAM User แทน Root Account**: สร้าง IAM user เฉพาะสำหรับ application
2. **จำกัดสิทธิ์**: ให้สิทธิ์เฉพาะที่จำเป็นเท่านั้น
3. **Rotate Credentials**: เปลี่ยน Access Key เป็นระยะ
4. **ใช้ Environment Variables**: ไม่ควร hardcode credentials ในโค้ด

### File Size Limits
- Maximum file size: 10 MB (ตั้งค่าใน multer middleware)
- Allowed file types: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

## Monitoring

### CloudWatch Metrics
สามารถติดตามการใช้งาน S3 ผ่าน CloudWatch:
- NumberOfObjects
- BucketSizeBytes
- AllRequests
- GetRequests
- PutRequests

### Cost Management
- ตรวจสอบค่าใช้จ่าย S3 ใน AWS Billing Console
- พิจารณาใช้ S3 Lifecycle policies เพื่อลบไฟล์เก่า

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/best-practices.html)

---
Last Updated: October 10, 2025
