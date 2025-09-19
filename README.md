# 🖥️ IT Resource Management System

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

## 📋 Overview

ระบบบริหารจัดการทรัพยากรไอที สำหรับองค์กรและสถาบันการศึกษา ช่วยแก้ปัญหาการจองซ้ำซ้อน การติดตามการยืม-คืน และการแจ้งซ่อมบำรุง เพื่อเพิ่มประสิทธิภาพการทำงานและการเรียนการสอน

*An IT resource management system for organizations and educational institutions. Solves problems of duplicate bookings, tracking loans-returns, and maintenance requests to enhance work efficiency and teaching.*

## ✨ Key Features

- 👤 **ระบบผู้ใช้งาน** — สมัครสมาชิก, ล็อกอิน, กำหนดบทบาท (User management)
- 🚪 **จัดการห้อง** — เพิ่ม/แก้ไข/ลบ, จอง, ดูสถานะการใช้งาน (Room management) 
- 💻 **จัดการอุปกรณ์** — เพิ่ม/แก้ไข/ลบ, ยืม-คืน, ติดตามสถานะ (Equipment management)
- 🔧 **แจ้งซ่อม** — แจ้งซ่อม, ติดตามสถานะ, อัพโหลดรูปภาพ (Maintenance reports)
- 🔐 **ความปลอดภัย** — ระบบยืนยันตัวตนด้วย JWT, การกำหนดสิทธิ์การเข้าถึง (Security)

## 🚀 Getting Started

### 1) Prerequisites
- Node.js 18 or higher
- MySQL 8.x or higher

### 2) Install Packages
Using PowerShell on Windows:

```powershell
npm install
```

### 3) Set Up Environment Variables
Create a `.env` file at the project root and add your database connection details:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=it_resource_db
```

### 4) Initial Database Setup (Sample Schema)
Minimum tables required by the models (with `is_deleted` and `name` columns):

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

> You can modify the schema, add columns, or create additional relationships as per your actual design

```powershell
node index.js
```

Then, open your browser and go to: http://localhost:3000

To run using `npm start`, add the script in `package.json` (optional):

## 🔑 Important API Endpoints
- `POST /auth/register` Register
- `POST /auth/login` Login
- `POST /auth/logout` Logout
- `GET /api/rooms` List rooms
- `GET /api/rooms/:id/bookings` View room bookings
- `GET /api/equipments` List equipments
- `GET /api/maintenance` List maintenance requests

## 🔒 Security
- Uses JWT and HttpOnly cookies for authentication
- Passwords are hashed with bcrypt
- RBAC: Role-based access control

## 👩‍💻 Staff Dashboard Features
- Manage rooms and booking statuses
- Manage equipments and loan statuses
- Manage maintenance requests with images and responsible personnel

## 📜 License
ISC