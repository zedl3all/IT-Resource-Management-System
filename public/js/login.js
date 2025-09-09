document.addEventListener("DOMContentLoaded", () => {
    // Select the login form
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page reload

        // Get form fields
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value.trim();

        // Basic validation
        if (!email || !password) {
            alert("กรุณากรอกอีเมลและรหัสผ่าน");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("รูปแบบอีเมลไม่ถูกต้อง");
            return;
        }

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Store token in localStorage for future API calls
                if (result.token) {
                    localStorage.setItem("token", result.token);
                }

                alert("เข้าสู่ระบบสำเร็จ!");
                // window.location.href = "/dashboard"; // Redirect to dashboard after login
            } else {
                alert(result.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }
    });

    // Password toggle functionality
    const togglePassword = document.querySelector('.toggle-password');
    const passwordField = document.querySelector('#password');

    togglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});