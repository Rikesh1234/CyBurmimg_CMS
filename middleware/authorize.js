// middleware/authorize.js

const Role = require('../models/Role');
const User = require('../models/user');

const authorize = (modelName, requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Check if the session user is set
            if (!req.session.user || !req.session.user.username) {
                console.error('User session is not properly set');
                return res.status(401).redirect('/admin/login')
            }

            // Fetch the user by username from the session
            const user = await User.findOne({ username: req.session.user.username });
            if (!user) {
                console.error('User not found');
                return res.status(401).redirect('/admin/login')
            }

            // Populate the role of the user
            await user.populate('role');
            if (!user.role) {
                console.error('Role not found for user');
                return res.status(401).redirect('/admin/login')
            }

            // Populate permissions for the user's role
            await user.populate({
                path: 'role.permissions',
                populate: { path: 'model' }
            });
            // Check if role has the required permission for the specified model
            const hasPermission = user.role.permissions.some(permission =>
                permission.type === requiredPermission && permission.model.name === modelName
            );

            if (!hasPermission) {
                console.error(`User lacks the required permission (${requiredPermission}) for model: ${modelName}`);
                return res.status(403).redirect(`/forbidden`);
            }

            // Move to the next middleware or route
            next();
        } catch (error) {
            console.error('Authorization error:', error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    };
};

module.exports = authorize;
