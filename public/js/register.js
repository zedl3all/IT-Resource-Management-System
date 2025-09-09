document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#register-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // กัน reload หน้า

    const username = document.querySelector("#username").value.trim();
    const role = document.querySelector("#role").value;
    const password = document.querySelector("#password").value;

    // Validation เบื้องต้น
    if (!username || !password) {
      alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    if (password.length < 6) {
      alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, role, password })
      });

      const result = await response.json();

      if (response.ok) {
        alert("สมัครสมาชิกสำเร็จ!");
        window.location.href = "/login"; // ไปหน้า login หลังสมัครเสร็จ
      } else {
        alert(result.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  });
});
