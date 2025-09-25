const jwt = require('jsonwebtoken');

// Check if JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables!');
    process.exit(1); // Stop the app to prevent security issues
}

const authenticateToken = (req, res, next) => {
    // รับ token จาก cookie เท่านั้น
    const token = req.cookies?.token;
    
    console.log('Cookie Token:', token);
    
    // Check if token is present
    if (!token) {
        // return res.status(401).render('login', {
        //         success: false,
        //         message: 'โทเค็นไม่ถูกต้องหรือหมดอายุ โปรดเข้าสู่ระบบใหม่',
        //         error: 'Invalid or expired token'
        //     });
        return res.redirect('/login');
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).render('login', {
                success: false,
                message: 'โทเค็นไม่ถูกต้องหรือหมดอายุ โปรดเข้าสู่ระบบใหม่',
                error: 'Invalid or expired token'
            });
        }
        
        // ตรวจสอบว่า payload มีข้อมูลที่จำเป็นหรือไม่
        if (!decoded.userId || !decoded.role) {
            console.error('Invalid token structure:', decoded);
            return res.status(403).render('login', {
                success: false,
                message: 'โทเค็นไม่ถูกต้อง โปรดเข้าสู่ระบบใหม่',
                error: 'Invalid token structure'
            });
        }
        
        req.user = decoded;
        console.log('Authenticated user:', decoded);
        next();
    });
};

module.exports = authenticateToken;