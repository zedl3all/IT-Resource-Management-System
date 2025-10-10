# 🖥️ IT Resource Management System ⚠️!!Broken!!⚠️

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## 📋 Overview

ระบบบริหารจัดการทรัพยากรไอที (IT Resource Management System) เป็นแพลตฟอร์มแบบ Web Application ที่พัฒนาขึ้นสำหรับองค์กรและสถาบันการศึกษา เพื่อแก้ไขปัญหาการจัดการทรัพยากร IT อย่างมีประสิทธิภาพ

### ปัญหาที่แก้ไข
- 🚫 **การจองซ้ำซ้อน** - ป้องกันการจองห้องและอุปกรณ์ที่ขัดแย้งกัน
- 📊 **การติดตามยาก** - ติดตามสถานะการยืม-คืนอุปกรณ์แบบเรียลไทม์
- 🔧 **การแจ้งซ่อมไม่เป็นระบบ** - จัดการและติดตามสถานะการซ่อมบำรุงอย่างมีประสิทธิภาพ
- 👥 **การจัดการผู้ใช้** - ระบบบทบาทและสิทธิ์การเข้าถึงที่ชัดเจน

## ✨ Key Features

### 👤 User Management (ระบบจัดการผู้ใช้)
- ✅ ลงทะเบียนและเข้าสู่ระบบด้วย JWT Authentication
- ✅ บทบาทผู้ใช้ 3 ระดับ: User, Staff, Admin
- ✅ ระบบจัดการโปรไฟล์ผู้ใช้
- ✅ การค้นหาผู้ใช้ด้วย email และ username

### 🚪 Room Management (จัดการห้อง)
- ✅ เพิ่ม/แก้ไข/ลบห้องประชุมและห้องทำงาน
- ✅ ระบบจองห้องพร้อมตรวจสอบความพร้อมใช้งาน
- ✅ ดูตารางการจองรายเดือน
- ✅ ยกเลิกการจองได้ทันที
- ✅ Soft Delete - กู้คืนข้อมูลที่ถูกลบได้
- ✅ รองรับการจองข้ามวัน (Cross-day booking)

### 💻 Equipment Management (จัดการอุปกรณ์)
- ✅ เพิ่ม/แก้ไข/ลบอุปกรณ์ IT
- ✅ ระบบยืม-คืนอุปกรณ์อัตโนมัติ
- ✅ จัดหมวดหมู่อุปกรณ์ตามประเภท
- ✅ ตรวจสอบสถานะการใช้งาน (ว่าง/ถูกจอง/ซ่อมบำรุง)
- ✅ ติดตามประวัติการยืม-คืน
- ✅ แจ้งเตือนเมื่อถึงกำหนดคืน

### 🔧 Maintenance Management (จัดการการแจ้งซ่อม)
- ✅ แจ้งซ่อมพร้อมอัพโหลดรูปภาพ (รองรับหลายรูป)
- ✅ เก็บรูปภาพบน AWS S3 Cloud Storage
- ✅ มอบหมายงานให้เจ้าหน้าที่
- ✅ ติดตามสถานะ: รอดำเนินการ → กำลังซ่อม → เสร็จสิ้น
- ✅ ดูประวัติการแจ้งซ่อมทั้งหมด
- ✅ ระบบแสดงรูปภาพแบบ Image Viewer
- ✅ Public URL สำหรับเข้าถึงรูปภาพ

### 🔐 Security & Authentication
- ✅ JWT Token Authentication
- ✅ HttpOnly Cookies สำหรับความปลอดภัย
- ✅ Password Hashing ด้วย bcrypt
- ✅ Role-Based Access Control (RBAC)
- ✅ Session Management

### 📡 Real-time Updates
- ✅ Socket.IO สำหรับการอัปเดตแบบเรียลไทม์
- ✅ แจ้งเตือนเมื่อมีการเปลี่ยนแปลงสถานะ
- ✅ ซิงค์ข้อมูลระหว่างผู้ใช้หลายคน

### 📊 API Documentation
- ✅ Swagger UI Documentation
- ✅ ครอบคลุมทุก API endpoints
- ✅ ทดสอบ API ได้โดยตรง
- ✅ Schema และ Response Examples

## 🏗️ Technology Stack

### Backend
- **Node.js** 18+ - JavaScript Runtime
- **Express.js** 5.x - Web Framework
- **MySQL** 8.x - Database
- **Socket.IO** 4.x - Real-time Communication
- **JWT** - Authentication
- **Multer** - File Upload Handling
- **bcrypt** - Password Hashing
- **AWS S3** - Cloud Storage for Images

### Frontend
- **EJS** - Templating Engine
- **Vanilla JavaScript** - Client-side Logic
- **CSS3** - Styling
- **Font Awesome** - Icons

### Documentation
- **Swagger/OpenAPI** 3.0 - API Documentation
- **swagger-jsdoc** - Swagger Generator
- **swagger-ui-express** - API Documentation UI

## 🚀 Getting Started

### Prerequisites
ตรวจสอบให้แน่ใจว่าคุณมีโปรแกรมเหล่านี้ติดตั้งแล้ว:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **MySQL** 8.x or higher ([Download](https://dev.mysql.com/downloads/))
- **Git** (optional) ([Download](https://git-scm.com/))

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/zedl3all/IT-Resource-Management-System.git
cd IT-Resource-Management-System
```

#### 2. Install Dependencies
```powershell
npm install
```

#### 3. Database Setup
สร้างฐานข้อมูลใน MySQL:
```sql
CREATE DATABASE IF NOT EXISTS it_resource_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

นำเข้า schema จากไฟล์:
```bash
mysql -u root -p it_resource_db < itrm.sql
```

หรือใช้ MySQL Workbench:
1. เปิด MySQL Workbench
2. เชื่อมต่อกับ MySQL Server
3. File → Run SQL Script
4. เลือกไฟล์ `itrm.sql`
5. คลิก "Run"

#### 4. Environment Configuration
สร้างไฟล์ `.env` ที่ root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=it_resource_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# AWS S3 Configuration (สำหรับเก็บรูปภาพ)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=itrms-uploads-bucket-2025
```

**หมายเหตุ:** สำหรับการตั้งค่า AWS S3 โปรดดูรายละเอียดใน [AWS S3 Setup Guide](docs/AWS_S3_SETUP.md)

#### 5. Test S3 Connection (Optional)
ทดสอบการเชื่อมต่อกับ AWS S3:
```powershell
node test-s3-connection.js
```

#### 6. Start Server
```powershell
# Development mode with auto-reload
npm run dev

# Production mode
node index.js
```

เปิดเบราว์เซอร์และไปที่: `http://localhost:3000`

## 📁 Project Structure

```
IT-Resource-Management-System/
├── config/
│   └── db.js                      # Database configuration
├── controllers/
│   ├── Auth_Controller.js         # Authentication logic
│   ├── User_Controller.js         # User management
│   ├── Room_Controller.js         # Room management
│   ├── Equipment_Controller.js    # Equipment management
│   ├── Maintenance_Controller.js  # Maintenance management
│   ├── Image_Controller.js        # Image handling
│   ├── equipment-types_Controller.js
│   ├── Error_Controller.js
│   └── Web_Controller.js
├── models/
│   ├── User_Model.js
│   ├── Room_Model.js
│   ├── Equipment_Model.js
│   ├── Maintenance_Model.js
│   └── EquipmentType_Model.js
├── routes/
│   ├── AuthRoute.js
│   ├── UserRoute.js
│   ├── RoomRoute.js
│   ├── EquipmentRoute.js
│   ├── MaintenanceRoute.js
│   ├── ImageRoute.js
│   ├── equipment-typesRoute.js
│   ├── ErrorRoute.js
│   └── WebRoutes.js
├── middleware/
│   ├── Auth_Middleware.js         # JWT verification
│   ├── CheckRole.js               # Role-based access control
│   ├── Upload_Middleware.js       # Multer file upload
│   └── UpdateService.js           # Status update service
├── views/
│   ├── index.ejs                  # Landing page
│   ├── login.ejs                  # Login page
│   ├── register.ejs               # Registration page
│   ├── user.ejs                   # User dashboard
│   ├── staff.ejs                  # Staff dashboard
│   └── error.ejs                  # Error page
├── public/
│   ├── css/                       # Stylesheets
│   ├── js/                        # Client-side JavaScript
│   └── img/                       # Images
├── docs/
│   ├── swagger.js                 # Swagger configuration
│   ├── schemas/                   # API schemas
│   │   ├── userSchemas.js
│   │   ├── roomSchemas.js
│   │   ├── equipmentSchemas.js
│   │   ├── maintenanceSchemas.js
│   │   ├── authSchemas.js
│   │   ├── equipmentTypeSchemas.js
│   │   └── imageSchemas.js
│   └── paths/                     # API paths
│       ├── userPaths.js
│       ├── roomPaths.js
│       ├── equipmentPaths.js
│       ├── maintenancePaths.js
│       ├── authPaths.js
│       ├── equipmentTypePaths.js
│       └── imagePaths.js
├── Images/
│   └── maintenance/               # Uploaded maintenance images
├── index.js                       # Main application file
├── package.json
├── .env                           # Environment variables
├── .gitignore
├── itrm.sql                       # Database schema
├── LICENSE
└── README.md
```

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | สมัครสมาชิก | Public |
| POST | `/auth/login` | เข้าสู่ระบบ | Public |
| POST | `/auth/logout` | ออกจากระบบ | Authenticated |
| GET | `/auth/profile` | ดูโปรไฟล์ | Authenticated |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | รายการผู้ใช้ทั้งหมด | Staff/Admin |
| GET | `/api/users/:id` | ดูข้อมูลผู้ใช้ | Authenticated |
| GET | `/api/users/search/:keyword` | ค้นหาผู้ใช้ | Staff/Admin |
| POST | `/api/users` | สร้างผู้ใช้ใหม่ | Admin |
| PUT | `/api/users/:id` | แก้ไขข้อมูลผู้ใช้ | Admin |
| DELETE | `/api/users/:id` | ลบผู้ใช้ (Soft delete) | Admin |
| POST | `/api/users/:id/restore` | กู้คืนผู้ใช้ | Admin |
| GET | `/api/users/findByEmail/:email` | ค้นหาด้วย Email | Staff/Admin |
| GET | `/api/users/findByUsername/:username` | ค้นหาด้วย Username | Staff/Admin |
| GET | `/api/users/staff/all` | รายการ Staff ทั้งหมด | Staff/Admin |

### Rooms & Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/rooms` | รายการห้องทั้งหมด | Authenticated |
| GET | `/api/rooms/:id` | ดูข้อมูลห้อง | Authenticated |
| GET | `/api/rooms/search/:keyword` | ค้นหาห้อง | Authenticated |
| POST | `/api/rooms` | เพิ่มห้องใหม่ | Staff/Admin |
| PUT | `/api/rooms/:id` | แก้ไขข้อมูลห้อง | Staff/Admin |
| DELETE | `/api/rooms/:id` | ลบห้อง (Soft delete) | Staff/Admin |
| POST | `/api/rooms/:id/restore` | กู้คืนห้อง | Admin |
| GET | `/api/rooms/:id/bookings` | ดูการจองของห้อง | Authenticated |
| GET | `/api/rooms/:id/bookings/month` | ดูการจองรายเดือน | Authenticated |
| GET | `/api/rooms/:id/availability` | ตรวจสอบความพร้อมใช้งาน | Authenticated |
| POST | `/api/rooms/:id/bookings` | จองห้อง | Authenticated |
| GET | `/api/rooms/user/:userId/bookings` | ดูการจองของผู้ใช้ | Authenticated |
| DELETE | `/api/rooms/cancel-booking/:id` | ยกเลิกการจอง | Authenticated |

### Equipments & Loans
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/equipments` | รายการอุปกรณ์ทั้งหมด | Authenticated |
| GET | `/api/equipments/:id` | ดูข้อมูลอุปกรณ์ | Authenticated |
| GET | `/api/equipments/search/:keyword` | ค้นหาอุปกรณ์ | Authenticated |
| POST | `/api/equipments` | เพิ่มอุปกรณ์ใหม่ | Staff/Admin |
| PUT | `/api/equipments/:id` | แก้ไขข้อมูลอุปกรณ์ | Staff/Admin |
| DELETE | `/api/equipments/:id` | ลบอุปกรณ์ (Soft delete) | Staff/Admin |
| POST | `/api/equipments/:id/restore` | กู้คืนอุปกรณ์ | Admin |
| GET | `/api/equipments/:equipmentId/loans` | ดูประวัติการยืม | Authenticated |
| GET | `/api/equipments/user/:userId/loans` | ดูการยืมของผู้ใช้ | Authenticated |
| POST | `/api/equipments/:id/loans` | ยืมอุปกรณ์ | Authenticated |
| PATCH | `/api/equipments/:loanId/return` | คืนอุปกรณ์ | Authenticated |

### Maintenance
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/maintenances` | รายการแจ้งซ่อมทั้งหมด | Staff/Admin |
| GET | `/api/maintenances/:id` | ดูรายละเอียดการแจ้งซ่อม | Authenticated |
| GET | `/api/maintenances/search/:keyword` | ค้นหาการแจ้งซ่อม | Staff/Admin |
| POST | `/api/maintenances` | แจ้งซ่อม (รองรับไฟล์รูป) | Authenticated |
| PUT | `/api/maintenances/:id` | แก้ไขการแจ้งซ่อม | Staff/Admin |
| DELETE | `/api/maintenances/:id` | ลบการแจ้งซ่อม (Soft delete) | Staff/Admin |
| POST | `/api/maintenances/:id/restore` | กู้คืนการแจ้งซ่อม | Admin |
| GET | `/api/maintenances/user/:userId` | ดูการแจ้งซ่อมของผู้ใช้ | Authenticated |
| PATCH | `/api/maintenances/:id/updateStaffAndStatus` | อัพเดทเจ้าหน้าที่และสถานะ | Staff/Admin |

### Equipment Types
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/equipment-types` | รายการประเภทอุปกรณ์ | Authenticated |

### Images
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/images?path=` | ดูรูปภาพ | Authenticated |
| GET | `/api/images/list?directory=` | รายการรูปภาพในโฟลเดอร์ | Staff/Admin |

### Swagger Documentation
| Endpoint | Description |
|----------|-------------|
| `/api-docs` | Swagger UI - Interactive API Documentation |

## 📖 API Documentation

เข้าถึง Swagger UI สำหรับ API Documentation แบบ Interactive:

```
http://localhost:3000/api-docs
```

### Features ของ Swagger UI
- 📝 รายละเอียดครบถ้วนของทุก endpoints
- 🧪 ทดสอบ API ได้โดยตรง
- 📊 Schema และ Response Examples
- 🏷️ จัดกลุ่มตามหมวดหมู่
- 🔐 รองรับ Authentication Testing

## 👥 User Roles & Permissions

| Feature | User | Staff | Admin |
|---------|------|-------|-------|
| ลงทะเบียน/เข้าสู่ระบบ | ✅ | ✅ | ✅ |
| ดูห้องและอุปกรณ์ | ✅ | ✅ | ✅ |
| จองห้อง/ยืมอุปกรณ์ | ✅ | ✅ | ✅ |
| แจ้งซ่อม | ✅ | ✅ | ✅ |
| จัดการห้อง/อุปกรณ์ | ❌ | ✅ | ✅ |
| จัดการการแจ้งซ่อม | ❌ | ✅ | ✅ |
| มอบหมายเจ้าหน้าที่ | ❌ | ✅ | ✅ |
| จัดการผู้ใช้ | ❌ | ❌ | ✅ |
| Soft Delete/Restore | ❌ | ❌ | ✅ |

## 🎯 Use Cases

### สำหรับผู้ใช้ทั่วไป (User)
1. **จองห้องประชุม**
   - เลือกห้อง → เลือกวันเวลา → ระบุวัตถุประสงค์ → ยืนยันการจอง
   - ดูตารางการจองของตัวเอง
   - ยกเลิกการจองก่อนเวลาที่กำหนด

2. **ยืมอุปกรณ์**
   - เลือกอุปกรณ์ → กำหนดวันยืม-คืน → ระบุวัตถุประสงค์
   - คืนอุปกรณ์เมื่อใช้งานเสร็จ
   - ติดตามประวัติการยืม

3. **แจ้งซ่อม**
   - ระบุอุปกรณ์และปัญหา
   - อัพโหลดรูปภาพประกอบ
   - ติดตามสถานะการซ่อม

### สำหรับเจ้าหน้าที่ (Staff)
1. **จัดการทรัพยากร**
   - เพิ่ม/แก้ไข/ลบ ห้องและอุปกรณ์
   - อัพเดทสถานะการใช้งาน
   - ดูสถิติการใช้งาน

2. **จัดการการซ่อมบำรุง**
   - รับแจ้งการซ่อม
   - มอบหมายงานให้เจ้าหน้าที่
   - อัพเดทสถานะการดำเนินการ
   - ดูประวัติการซ่อม

3. **ตรวจสอบการจอง**
   - ดูตารางการจองทั้งหมด
   - อนุมัติ/ปฏิเสธการจอง (ถ้ามี)
   - จัดการปัญหาการจองที่ขัดแย้ง

### สำหรับผู้ดูแลระบบ (Admin)
1. **จัดการผู้ใช้**
   - เพิ่ม/แก้ไข/ลบผู้ใช้
   - กำหนดบทบาทและสิทธิ์
   - ดูประวัติการใช้งาน

2. **การตั้งค่าระบบ**
   - กำหนดค่าเริ่มต้น
   - จัดการหมวดหมู่อุปกรณ์
   - Backup/Restore ข้อมูล

3. **รายงานและวิเคราะห์**
   - สถิติการใช้งานรายวัน/เดือน/ปี
   - รายงานอุปกรณ์ที่มีปัญหา
   - วิเคราะห์แนวโน้มการใช้งาน

## 🔒 Security Features

### Authentication & Authorization
- **JWT Token** - Stateless authentication
- **HttpOnly Cookies** - ป้องกัน XSS attacks
- **bcrypt** - Password hashing with salt rounds
- **Role-Based Access Control** - จำกัดการเข้าถึงตามบทบาท

### Data Protection
- **Input Validation** - ตรวจสอบข้อมูลนำเข้าทุกครั้ง
- **SQL Injection Prevention** - ใช้ Prepared Statements
- **File Upload Validation** - จำกัดประเภทและขนาดไฟล์
- **Soft Delete** - เก็บข้อมูลที่ถูกลบไว้สำหรับกู้คืน

### Session Management
- **Token Expiration** - JWT มีอายุจำกัด
- **Automatic Logout** - หมดอายุ session อัตโนมัติ
- **Concurrent Session Control** - จำกัดการล็อกอินพร้อมกัน

## 🐛 Known Issues & Limitations

### Current Limitations
1. ไม่รองรับ Multi-language (ภาษาไทยเท่านั้น)
2. ไม่มีระบบแจ้งเตือนทาง Email/SMS
3. ไม่มีระบบ Calendar Integration (Google Calendar, Outlook)
4. การอัพโหลดรูปภาพจำกัดที่ 1 รูปต่อครั้ง

### Planned Features (Future Updates)
- [ ] Multi-language support (EN, TH)
- [ ] Email notifications
- [ ] Mobile application (iOS/Android)
- [ ] Calendar synchronization
- [ ] Advanced reporting and analytics
- [ ] QR Code for equipment tracking
- [ ] Integration with IoT devices

## 🧪 Testing

### Manual Testing
```bash
# Start server in development mode
npm run dev
```

### Test Accounts
```
Admin Account:
- Email: admin@example.com
- Password: admin123

Staff Account:
- Email: staff@example.com
- Password: staff123

User Account:
- Email: user@example.com
- Password: user123
```

## 📊 Database Schema

### Main Tables
- **users** - ข้อมูลผู้ใช้และการยืนยันตัวตน
- **rooms** - ข้อมูลห้องประชุมและห้องทำงาน
- **booking** - ข้อมูลการจองห้อง
- **equipment** - ข้อมูลอุปกรณ์ IT
- **equipment_type** - หมวดหมู่อุปกรณ์
- **equipment_has_type** - ความสัมพันธ์ระหว่างอุปกรณ์และประเภท
- **loan** - ข้อมูลการยืม-คืนอุปกรณ์
- **maintenance** - ข้อมูลการแจ้งซ่อม

### Key Relationships
- User (1) → (N) Booking
- User (1) → (N) Loan
- User (1) → (N) Maintenance
- Room (1) → (N) Booking
- Equipment (1) → (N) Loan
- Equipment (N) → (N) Equipment_Type

## 🤝 Contributing

เรายินดีรับ Contributions! หากคุณต้องการมีส่วนร่วมในการพัฒนา:

1. Fork repository
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

### Development Guidelines
- ใช้ ESLint สำหรับ code style
- เขียน comments เป็นภาษาไทยหรืออังกฤษ
- ทดสอบ features ก่อน commit
- อัพเดต documentation เมื่อเพิ่ม features ใหม่

## 📝 Version History

### Version 1.0.0 (Current)
- ✅ ระบบจัดการผู้ใช้และ Authentication
- ✅ ระบบจองห้องและอุปกรณ์
- ✅ ระบบแจ้งซ่อมพร้อมอัพโหลดรูปภาพ
- ✅ Real-time updates ด้วย Socket.IO
- ✅ API Documentation ด้วย Swagger
- ✅ Responsive Design

## 👨‍💻 Authors & Contributors

- **zedl3all** - *Initial work* - [GitHub](https://github.com/zedl3all)
- **FirzKung** - *Contributor* - [GitHub](https://github.com/66070266)
- **Natokung** - *Contributor* - [GitHub](https://github.com/66070277Noppawit)

## 📞 Support & Contact

หากมีปัญหาหรือข้อสงสัย:
- 📧 Email: sanguanwongtanapat@gmail.com
- 📱 Tel: +6688-507-4781
- 🐛 Issues: [GitHub Issues](https://github.com/zedl3all/IT-Resource-Management-System/issues)
- 📖 Documentation: [API Docs](http://localhost:3000/api-docs)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 zedl3all

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Socket.IO](https://socket.io/)
- [Swagger](https://swagger.io/)
- [Font Awesome](https://fontawesome.com/)
- King Mongkut's Institute of Technology Ladkrabang (KMITL)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/zedl3all">zedl3all</a> and contributors
</p>

<p align="center">
  <a href="#-it-resource-management-system">Back to top ↑</a>
</p>