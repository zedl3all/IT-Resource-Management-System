jest.setTimeout(30000);

// Global teardown - ปิด connection หลังเสร็จสิ้น test
afterAll(() => {
  try {
    // Close db connections or other resources
    const db = require('../config/db');
    
    // คืนค่าเป็น Promise สำหรับปิดการเชื่อมต่อ
    return new Promise((resolve) => {
      // ตรวจสอบว่า db.end มีอยู่จริงหรือไม่
      if (db && typeof db.end === 'function') {
        db.end(() => {
          console.log('Database connection closed');
          resolve();
        });
      } else {
        console.log('Database connection not available or already closed');
        resolve();
      }
    });
  } catch (err) {
    console.error('Error closing database connection:', err);
    return Promise.resolve();
  }
});