# IT Resource Management System

ในปัจจุบันการบริหารจัดการทรัพยากรไอทีภายในคณะมักเผชิญกับปัญหาด้านประสิทธิภาพ ไม่ว่าจะเป็นความยุ่งยากในการตรวจสอบสถานะการใช้งาน การจองที่ซ้ำซ้อน และการติดตามการยืม-คืนอุปกรณ์ที่ขาดระบบจัดการที่ดี รวมถึงการแจ้งซ่อมบำรุงที่ไม่มีระบบติดตามสถานะที่ชัดเจน ซึ่งปัญหาเหล่านี้ล้วนส่งผลกระทบโดยตรงต่อกระบวนการเรียนการสอนและการทำงานโดยรวมของคณะ
ดังนั้นคณะผู้จัดทำจึงเล็งเห็นถึงความสำคัญของปัญหาเหล่านี้ และได้คิดริเริ่มพัฒนา IT Resource Management System ซึ่งเป็น Web Application เพื่อเป็นศูนย์กลางในการบริหารจัดการทรัพยากรไอทีแบบครบวงจร ระบบนี้จะอำนวยความสะดวกให้ผู้ใช้งานสามารถ จองห้องเรียน และ ยืม-คืนอุปกรณ์ไอที ได้อย่างเป็นระบบ นอกจากนี้ยังรองรับการ แจ้งและติดตามสถานะงานซ่อมบำรุง อุปกรณ์ได้อย่างโปร่งใส ด้วย Node.js + Express + MySQL

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

---

## ✨ ไฮไลต์
- จัดเก็บและค้นหาทรัพยากรไอที (Items) และห้อง (Rooms)
- บันทึกอุปกรณ์ที่ชำรุด (Broken Items)
- แยกเลเยอร์ชัดเจน: `config` (DB), `models` (business queries), รองรับการเพิ่ม `controllers` / `routes`
- ใช้ `.env` สำหรับซ่อนค่าเชื่อมต่อฐานข้อมูลอย่างปลอดภัย

> หมายเหตุ: โค้ดเริ่มต้นนี้เป็นสเกลตันสำหรับต่อยอด (controllers/routes ยังว่างอยู่) แต่ models และการเชื่อมต่อ MySQL พร้อมใช้งานแล้ว

---

# IT Resource Management System
```
IT-Resource-Management-System/
├─ index.js                # จุดเริ่มต้นของเซิร์ฟเวอร์ Express
├─ package.json
├─ controllers/           # (เว้นว่างไว้สำหรับต่อยอด)
├─ routes/                # (เว้นว่างไว้สำหรับต่อยอด)
└─ views/                 # (เว้นว่างไว้สำหรับต่อยอด)
```

---

## 🚀 การเริ่มต้นใช้งาน (Getting Started)

### 1) ติดตั้งสิ่งที่ต้องมี
- Node.js 18 ขึ้นไป
- MySQL 8.x ขึ้นไป

### 2) ติดตั้งแพ็กเกจ
ใช้ PowerShell บน Windows:

```powershell
npm install
```

### 3) ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ที่รากโปรเจกต์ แล้วใส่ค่าตามฐานข้อมูลของคุณ:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=it_resource_db
```

### 4) เตรียมฐานข้อมูลเบื้องต้น (ตัวอย่างสคีมาอย่างย่อ)
ตัวอย่างตารางขั้นต่ำที่ models ใช้งาน (มีคอลัมน์ `is_deleted` และ `name`):

```sql
CREATE DATABASE IF NOT EXISTS it_resource_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE it_resource_db;

CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,

> คุณสามารถปรับสคีมา เพิ่มคอลัมน์ หรือสร้างความสัมพันธ์เพิ่มเติมได้ตามการออกแบบจริง

```powershell
node index.js
```

จากนั้นเปิดเบราว์เซอร์ที่: http://localhost:3000

ถ้าต้องการสั่งรันแบบ `npm start` ให้เพิ่มสคริปต์ใน `package.json` (ตัวเลือก):
# IT Resource Management System

ระบบจัดการทรัพยากรไอทีสำหรับองค์กร/คณะ รองรับการจองห้อง ยืม-คืนอุปกรณ์ และแจ้งซ่อมบำรุง

## คุณสมบัติหลัก
- จัดการผู้ใช้งาน (สมัครสมาชิก, ล็อกอิน, กำหนดบทบาท)
- จัดการห้อง (เพิ่ม/แก้ไข/ลบ, จอง, ดูสถานะ)
- จัดการอุปกรณ์ (เพิ่ม/แก้ไข/ลบ, ยืม-คืน, ดูสถานะ)
- แจ้งซ่อมบำรุง (แจ้งซ่อม, ติดตามสถานะ, อัพโหลดรูปภาพ)
- ระบบยืนยันตัวตนด้วย JWT และ Cookie
- กำหนดสิทธิ์การเข้าถึงตามบทบาท (admin, staff, user)

## โครงสร้างโปรเจกต์
```
IT-Resource-Management-System/
├─ index.js                # จุดเริ่มต้นเซิร์ฟเวอร์ Express
├─ package.json            # รายการ dependencies
├─ .env                    # ตัวแปรสภาพแวดล้อม
├─ config/
│  └─ db.js               # การเชื่อมต่อฐานข้อมูล MySQL
├─ controllers/
│  ├─ Auth_Controller.js  # จัดการ auth
│  ├─ User_Controller.js  # จัดการผู้ใช้
│  ├─ Web_Controller.js   # จัดการหน้าเว็บ
│  └─ ...
├─ middleware/
│  ├─ Auth_Middleware.js  # ตรวจสอบ token
│  ├─ CheckRole.js        # ตรวจสอบสิทธิ์
│  └─ ...
├─ models/
│  ├─ User_Model.js       # โมเดลผู้ใช้
│  ├─ Room_Model.js       # โมเดลห้อง
│  ├─ Equipment_Model.js  # โมเดลอุปกรณ์
│  └─ Maintenance_Model.js # โมเดลแจ้งซ่อม
├─ routes/
│  ├─ AuthRoute.js        # เส้นทาง auth
│  ├─ WebRoutes.js        # เส้นทางหน้าเว็บ
│  ├─ RoomRoute.js        # เส้นทางห้อง
│  └─ ...
├─ public/
│  ├─ css/                # ไฟล์ CSS
│  ├─ js/                 # ไฟล์ JS ฝั่ง client
│  └─ images/             # รูปภาพ
└─ views/
   ├─ login.ejs           # หน้า login
   ├─ register.ejs        # หน้า register
   ├─ staff.ejs           # หน้า dashboard staff
   └─ ...
```

## วิธีใช้งาน
1. ติดตั้ง Node.js และ MySQL
2. `npm install` ติดตั้ง dependencies
3. สร้างไฟล์ `.env` และตั้งค่าตัวแปรเชื่อมต่อฐานข้อมูล + JWT_SECRET
4. สร้างฐานข้อมูลและตารางตามตัวอย่างในไฟล์ itrm.sql
5. `node index.js` เพื่อรันเซิร์ฟเวอร์

## API สำคัญ
- `POST /auth/register` สมัครสมาชิก
- `POST /auth/login` ล็อกอิน
- `POST /auth/logout` ออกจากระบบ
- `GET /api/rooms` ดูรายการห้อง
- `GET /api/rooms/:id/bookings` ดูการจองห้อง
- `GET /api/equipments` ดูรายการอุปกรณ์
- `GET /api/maintenance` ดูรายการแจ้งซ่อม

## ระบบความปลอดภัย
- ใช้ JWT และ Cookie (httpOnly) สำหรับ auth
- รหัสผ่านเข้ารหัสด้วย bcrypt
- RBAC: จำกัดสิทธิ์ตามบทบาท

## ฟีเจอร์หน้า Staff Dashboard
- ดู/จัดการห้องและสถานะการจอง
- ดู/จัดการอุปกรณ์และสถานะการยืม
- ดู/จัดการรายการแจ้งซ่อม พร้อมรูปภาพและผู้รับผิดชอบ

## License
ISC