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

## 📁 โครงสร้างโปรเจกต์
```
IT-Resource-Management-System/
├─ index.js                # จุดเริ่มต้นของเซิร์ฟเวอร์ Express
├─ package.json
├─ config/
│  └─ db.js               # ตั้งค่าการเชื่อมต่อ MySQL ผ่าน mysql2 + dotenv
├─ models/
│  ├─ Item_Model.js       # ฟังก์ชันดึงรายการ Items พื้นฐาน
│  ├─ Room_Model.js       # ฟังก์ชันดึงรายการ Rooms พื้นฐาน
│  └─ Broken_items_Model.js # ฟังก์ชันดึงรายการ Broken Items พื้นฐาน
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS broken_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> คุณสามารถปรับสคีมา เพิ่มคอลัมน์ หรือสร้างความสัมพันธ์เพิ่มเติมได้ตามการออกแบบจริง

### 5) รันเซิร์ฟเวอร์
โค้ดปัจจุบันสามารถสตาร์ตด้วยคำสั่งต่อไปนี้:

```powershell
node index.js
```

จากนั้นเปิดเบราว์เซอร์ที่: http://localhost:3000

ถ้าต้องการสั่งรันแบบ `npm start` ให้เพิ่มสคริปต์ใน `package.json` (ตัวเลือก):

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

---

## 🧩 สถาปัตยกรรมโดยย่อ
- `config/db.js` จัดการเชื่อมต่อฐานข้อมูล MySQL ด้วย `mysql2` และอ่านค่าจาก `.env`
- `models/*.js` มีฟังก์ชันตัวอย่าง เช่น `getAll`, `getById`, `searchByKeyword` สำหรับ `items`, `rooms`, `broken_items`
- `index.js` เปิด Express Server และตอบกลับ `Hello World!` ที่ `/`

> แนะนำให้เพิ่มโครงสร้าง `controllers` และ `routes` เพื่อแยกชั้นเรียกใช้ `models` ให้ชัดเจน เมื่อเริ่มทำ API จริง

---

## 🔌 จุดเชื่อมต่อ API (Roadmap)
โครงร่าง API ที่คาดว่าจะมี (ยังไม่ Implement ในโค้ดปัจจุบัน):
- `GET /api/items` — ดึงรายการ Items
- `GET /api/items/:id` — ดึง Item ตาม ID
- `GET /api/items/search?keyword=...` — ค้นหา Item ตามคีย์เวิร์ด
- (ลักษณะเดียวกันสำหรับ `rooms` และ `broken_items`)

> เมื่อเพิ่ม routes/controllers แล้วให้ใส่รายละเอียด Request/Response ตัวอย่าง และรหัสสถานะ (HTTP Status Codes) ในส่วนนี้

---

## ⚙️ การตั้งค่าและแปรผัน (Configuration)
ตัวแปร `.env` ที่รองรับ:

- `DB_HOST` โฮสต์ของ MySQL (เช่น `localhost`)
- `DB_PORT` พอร์ตของ MySQL (ปกติ `3306`)
- `DB_USER` ชื่อผู้ใช้ MySQL
- `DB_PASSWORD` รหัสผ่าน MySQL
- `DB_DATABASE` ชื่อฐานข้อมูลที่ใช้งาน

หากเชื่อมต่อสำเร็จ จะเห็นข้อความในคอนโซล: `✅ Connected to MySQL`

---

## 🧪 การทดสอบ
ยังไม่ได้ตั้งค่า test ในโปรเจกต์นี้ หากต้องการเริ่มต้น แนะนำเพิ่ม Jest หรือ Vitest พร้อมชุดทดสอบ models และ routes เมื่อพร้อมพัฒนา API จริง

---

## 🛠️ เคล็ดลับการดีบัก
- หากเชื่อมต่อฐานข้อมูลไม่ได้ ให้ตรวจสอบไฟล์ `.env` และสิทธิ์ผู้ใช้ใน MySQL
- ตรวจสอบว่าตารางมีคอลัมน์ `is_deleted` และ `name` ตามที่ models ใช้งาน
- ใช้ `console.log` ตรวจสอบ query และค่าพารามิเตอร์เบื้องต้น

---

## 🤝 การมีส่วนร่วม (Contributing)
- เปิด Issue เพื่อรายงานบั๊กหรือเสนอฟีเจอร์
- เมื่อส่ง PR กรุณาแนบรายละเอียดสิ่งที่เปลี่ยนและวิธีทดสอบอย่างย่อ

---

## 📄 ใบอนุญาต (License)
โครงการนี้ใช้สัญญาอนุญาตแบบ ISC — โปรดดูรายละเอียดใน `package.json`

---

## 📌 แผนพัฒนาต่อ (Next Steps)
- [ ] เพิ่ม `routes` และ `controllers` สำหรับ items/rooms/broken_items
- [ ] เพิ่ม validation และ error handling กลาง
- [ ] เพิ่มสคริปต์ `npm start` และ `npm run dev` (เช่นใช้ nodemon)
- [ ] เขียนเอกสาร API (เช่น OpenAPI/Swagger)
- [ ] เพิ่มชุดทดสอบอัตโนมัติ (unit/integration)

หากต้องการให้ผมช่วยเปิดเส้นทาง API ชุดแรกหรือเพิ่ม Swagger Docs บอกได้เลย 👋