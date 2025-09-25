/**
 * Middleware to check if user has required role(s) to access a route
 * @param {string|string[]} allowedRoles - Single role or array of roles that can access this route
 * @returns {Function} Express middleware function
 */
const checkRole = (allowedRoles) => {
    // Convert single role to array for consistent handling
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    return (req, res, next) => {
        // Check if user exists (should be set by authenticateToken middleware)
        if (!req.user) {
            // Try to get token from cookies if not present in req.user
            const token = req.cookies?.token;

            if (token) {
                try {
                    // Verify and decode token from cookie
                    const jwt = require('jsonwebtoken');
                    req.user = jwt.verify(token, process.env.JWT_SECRET);
                } catch (err) {
                    return res.redirect('/error/401');
                }
            } else {
                return res.redirect('/error/401');
            }
        }

        const userRole = req.user.role;

        // Check if user has a role
        if (!userRole) {
            return res.redirect('/error/401');
        }

        // Admin role always has access to everything
        if (userRole === 'admin') {
            return next();
        }

        // Check if user role is in allowed roles
        if (roles.includes(userRole)) {
            return next();
        }

        // If we get here, user doesn't have permission
        return res.redirect('/error/403');
    };
};

module.exports = checkRole;