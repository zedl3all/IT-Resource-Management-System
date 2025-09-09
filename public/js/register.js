document.addEventListener("DOMContentLoaded", () => {
  // Select the correct form class from the EJS template
  const form = document.querySelector(".register-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload

    // Get all form fields from the EJS template
    const fullname = document.querySelector("#fullname").value.trim();
    const email = document.querySelector("#email").value.trim();
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();
    const confirmPassword = document.querySelector("#confirmPassword").value.trim();

    // Basic validation matching the controller requirements
    if (!fullname || !email || !username || !password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password.length < 6) {
      alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      alert("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullname: fullname,
          email: email,
          username: username,
          password: password,
          confirmPassword: confirmPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("สมัครสมาชิกสำเร็จ!");
        window.location.href = "/login"; // Redirect to login page after successful registration
      } else {
        alert(result.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  });

  // Keep the password toggle functionality
  const togglePassword = document.querySelector('.toggle-password');
  const passwordField = document.querySelector('#password');
  
  togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
  });
});