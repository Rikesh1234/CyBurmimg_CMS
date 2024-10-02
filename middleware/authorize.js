// middleware/authorize.js
const Role = require('../models/Role');

const authorize = (modelName, requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Get user role and permissions
            const userRole = await Role.findById(req.user.role).populate('permissions');

            // Check if role has the required permission for the specified model
            const hasPermission = userRole.permissions.some(permission =>
                permission.type === requiredPermission && permission.model.name === modelName
            );

            if (!hasPermission) {
                return res.status(403).json({ message: 'Forbidden: Access Denied' });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    };
};

module.exports = authorize;
