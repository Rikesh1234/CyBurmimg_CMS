// middleware/authorize.js
const Role = require('../models/Role');
const User = require('../models/user');


const authorize = (modelName, requiredPermission) => {
    return async (req, res, next) => {


        try {
            
            // Get user role and permissions
            // const userRole = await Role.findById(req.session.user.role).populate('permissions');
            const userRole = await User.findOne({ username: req.session.user.username })
            .populate({
              path: 'role',
              populate: { path: 'permissions', populate: { path: 'model' } }
            });
          
            // Check if role has the required permission for the specified model
            const hasPermission = userRole.role.permissions.some(permission =>
                permission.type === requiredPermission && permission.model.name === modelName
              );
              

            if (!hasPermission) {
                return res.redirect(`/forbidden`);                
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    };
};

module.exports = authorize;
