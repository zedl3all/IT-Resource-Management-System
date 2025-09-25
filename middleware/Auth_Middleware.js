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
        return res.redirect('/error/401');
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.redirect('/error/403');
        }
        
        // ตรวจสอบว่า payload มีข้อมูลที่จำเป็นหรือไม่
        if (!decoded.userId || !decoded.role) {
            console.error('Invalid token structure:', decoded);
            return res.redirect('/error/403');
        }
        
        req.user = decoded;
        console.log('Authenticated user:', decoded);
        next();
    });
};

module.exports = authenticateToken;