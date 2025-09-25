const ErrorController = {
    notFound(req, res) {
        res.status(404).render('error', {
            code: '404',
            icon: 'fa-search',
            title: 'ไม่พบหน้าที่คุณกำลังค้นหา',
            message: 'ขออภัย เราไม่พบหน้าที่คุณต้องการ หน้านี้อาจถูกย้าย ถูกลบ หรือไม่เคยมีอยู่',
            showBackButton: true,
            showLoginButton: false
        });
    },
    forbidden(req, res) {
        res.status(403).render('error', {
            code: '403',
            icon: 'fa-lock',
            title: 'ไม่มีสิทธิ์เข้าถึง',
            message: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้ โปรดติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด',
            showBackButton: true,
            showLoginButton: true
        });
    },
    unauthorized(req, res) {
        res.status(401).render('error', {
            code: '401',
            icon: 'fa-user-lock',
            title: 'กรุณาเข้าสู่ระบบ',
            message: 'คุณจำเป็นต้องเข้าสู่ระบบก่อนเข้าถึงหน้านี้',
            showBackButton: false,
            showLoginButton: true
        });
    },
    serverError(req, res, error) {
        console.error('Server Error:', error);
        res.status(500).render('error', {
            code: '500',
            icon: 'fa-exclamation-triangle',
            title: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์',
            message: 'ขออภัย เกิดข้อผิดพลาดภายในระบบ โปรดลองใหม่อีกครั้งในภายหลัง',
            showBackButton: true,
            showLoginButton: false
        });
    }
};

module.exports = ErrorController;