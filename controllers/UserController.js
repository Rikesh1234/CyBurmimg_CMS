const redis = require("../config/redis");
const Role = require("../models/Role");
const User = require("../models/user");
const Permission = require("../models/Permission");
const Model = require("../models/Model");
const CustomField = require("../models/CustomField");

const { validationResult } = require("express-validator");

exports.getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;

    // Fetch the role by ID
    const role = await Role.findById(roleId);

    if (!role) {
      return res.status(404).send("Role not found");
    }

    // Fetch all permissions (with model names populated)
    const allPermissions = await Permission.find().populate("model");

    // Fetch current permissions assigned to the role
    const rolePermissions = await Permission.find({
      _id: { $in: role.permissions },
    });

    // Transform rolePermissions into a map for easy lookup
    const rolePermissionMap = new Set(
      rolePermissions.map((perm) => `${perm.model._id}:${perm.type}`)
    );

    // Pass necessary data to the view
    res.render("users/permission/permission", {
      title: "Manage Permissions",
      role,
      allPermissions,
      rolePermissionMap, // Map of role's permissions for easy lookup
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Update permissions for a role
exports.updateRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params; // The ID of the role to update
    const permissions = req.body.permissions || []; // Permissions submitted by the form

    // Ensure permissions is always an array
    const permissionsArray = Array.isArray(permissions)
      ? permissions
      : [permissions];

    // Fetch the role to be updated
    const role = await Role.findById(roleId).populate("permissions");

    if (!role) {
      return res.status(404).send("Role not found");
    }

    // Create a new set of permissions based on the submitted data
    const newPermissions = await Promise.all(
      permissionsArray.map(async (permission) => {
        const [modelId, type] = permission.split(":");

        // Find or create a permission based on model and type
        let perm = await Permission.findOne({ model: modelId, type });
        if (!perm) {
          perm = new Permission({ model: modelId, type });
          await perm.save();
        }

        return perm._id;
      })
    );

    // Update the role's permissions
    role.permissions = newPermissions;

    // Save the updated role
    await role.save();

    // Redirect back to the role listing page
    res.redirect("/cms/role");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// Controller to handle the form submission
exports.savePermissions = (req, res) => {
  // Get all the permissions from the request body
  const permissions = req.body;

  // You can process these permissions as needed, for example, save them to a database
  console.log("Selected Permissions:", permissions);

  // Redirect back to the permissions page or any other page as needed
  res.redirect("/cms/permissions");
};

//view user page
exports.getUserPage = async (req, res) => {
  try {
    // Fetch all users from the database

    let users = await User.find().populate('role');

// Filter out users whose role is Admin
     users = users.filter(user => user.role.name !== 'Admin');

    //Render the view and pass the users to the EJS template
    res.render("users/user/user_listing", { title: "User Page", users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//view user Create page
exports.getUserCreatePage = async (req, res) => {
  try {

    let customField = await CustomField.find()
  .populate({
    path: 'model',  // Populate the 'model' field
    match: { path: '../models/user' } // Filter to only include models with the specified path
  })
  .populate({
    path: 'target_type', // Populate the 'field' field
  });

    // Fetch the logged-in user from the session
    const username = req.session.user.username;

    
    // Find the user in the database and populate their role
    const user = await User.findOne({ username }).populate('role');

    if (!user) {
      console.error('User not found');
      return res.status(404).send('User not found');
    }

    // Check the user's role to determine which roles should be shown in the dropdown
    const userRole = user.role.name; // Assuming `role` has a `name` field

    
    let activeRoles;

    // If the user is an admin, show all roles
    if (userRole === 'Admin') {
      activeRoles = await Role.find();
    } else {
      // If the user is not an admin, exclude the "admin" role
      activeRoles = await Role.find({ name: { $ne: 'Admin' } });
      
    }
  

    // Render the User Create/Edit page
    res.render('users/user/user_create_edit', {
      title: 'User Create Page',
      user: null,
      errorMessages: [],
      roles: activeRoles, // Pass the roles for the dropdown
      formData: {}, // Ensure formData is always an object for the form
      customField
    });

  } catch (err) {
    console.error('Error fetching user create page:', err);
    res.status(500).send('Server Error');
  }
};
  

//view user Edit page
exports.getUserEditPage = async (req, res) => {
  try {
    let customField = await CustomField.find()
  .populate({
    path: 'model',  // Populate the 'model' field
    match: { path: '../models/user' } // Filter to only include models with the specified path
  })
  .populate({
    path: 'target_type', // Populate the 'field' field
  });
    // Get the user ID from the request params
    const userId = req.params.userId;

    // Fetch all active roles for the dropdown
    // const activeRoles = await Role.find();

    const user = await User.findById(userId);

    // Fetch the user from the database, including their role
    const activeRoles = await Role.find({ name: { $ne: 'Admin' } });

    // If user not found, return a 404 error
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Render the edit view with the fetched user data and available roles
    res.render("users/user/user_create_edit", {
      title: "User Edit Page",
      user: user, // Pass the user object
      errorMessages: [],
      roles: activeRoles, // Pass roles for the dropdown
      customField
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//view role page
exports.getRolePage = async (req, res) => {
  try{

    // Fetch all roles from the database
    let roles = await Role.find();

    roles = roles.filter(role => role.name !== 'Admin');

      //Render the view and pass the users to the EJS template
      res.render('users/role/role_listing',{title:'Role Page', roles});
    }catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
}

//view role Create page
exports.getRoleCreatePage = async (req, res) => {

  let customField = await CustomField.find()
  .populate({
    path: 'model',  // Populate the 'model' field
    match: { path: '../models/Role' } // Filter to only include models with the specified path
  })
  .populate({
    path: 'target_type', // Populate the 'field' field
  });

  res.render("users/role/role_create_edit", {
    title: "Role Create Page",
    role: null,
    errorMessages: [],
    customField
  });
};

//view role Edit page
exports.getRoleEditPage = async (req, res) => {
  try {
    let customField = await CustomField.find()
  .populate({
    path: 'model',  // Populate the 'model' field
    match: { path: '../models/Role' } // Filter to only include models with the specified path
  })
  .populate({
    path: 'target_type', // Populate the 'field' field
  });
    // Find the role by its ID
    const role = await Role.findById(req.params.roleId);

    if (!role) {
      return res.status(404).send("Role not found");
    }

    // Render the edit page with the existing role data
    res.render("users/role/role_create_edit", {
      title: "Role Edit Page",
      role, // Pass the role object to the template
      customField,
      errorMessages:{}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//cruds for users
exports.createUser = [
  // Validation for required fields
  (req, res, next) => {
    const { username, role, email, password, confirm } = req.body;

    const errorMessages = [];

    // Check for required fields
    if (!username || username.trim() === "") errorMessages.push("Username is required.");
    if (!role || role.length === 0) errorMessages.push("Role is required.");
    if (!email || email.trim() === "") errorMessages.push("Email is required.");
    if (!password || password.trim() === "") errorMessages.push("Password is required.");
    if (!confirm || confirm.trim() === "") errorMessages.push("Confirm Password is required.");
    if (password !== confirm) errorMessages.push("Passwords do not match.");

    // If there are errors, re-render the form with error messages
    if (errorMessages.length > 0) {
      return res.render("users/user/user_create_edit", {
        title: "Create User",
        errorMessages,
        formData: req.body, // Repopulate form data
        user: null,
        roles: [], // Pass roles if needed
      });
    }

    next();
  },

  async (req, res) => {
    try {
      // Extract form data from the request body
      const { username, email, password, role, published, published_date } = req.body;

      // Create a new user object
      const newUser = new User({
        username,
        email,
        password,
        role, // Make sure this is set correctly
        published: published === "on",
        published_date: published_date || Date.now(),
      });

      // Save the user to the database
      await newUser.save();

      // Invalidate the cached user list
      await redis.del("/cms/user");

      // Redirect to the user listing page after successful creation
      res.redirect("/cms/user");
    } catch (err) {
      console.error(err);

      // In case of validation errors from Mongoose, handle them
      if (err.name === 'ValidationError') {
        const errorMessages = Object.values(err.errors).map(error => error.message);
        return res.render("users/user/user_create_edit", {
          title: "Create User",
          errorMessages,
          formData: req.body,
          user: null,
          roles: [], // Pass roles if needed
        });
      }

      // In case of any other errors, show server error
      res.status(500).send("Server Error");
    }
  },
];

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Invalidate the cached user list
    await redis.del("/cms/user");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/user");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Handle updating a user
exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  // Extract form data from the request body
  const { username, email, password, confirm, role, published, published_date } = req.body;

  // Array to collect validation errors
  const errorMessages = [];

  // Perform manual validation on required fields
  if (!username || username.trim() === "") errorMessages.push("username is required");
  if (!email || email.trim() === "") errorMessages.push("Email is required");
  
  // Password validation logic
  if (password === undefined || password === "") {
    // If password is not provided, we do not check confirm password
    if (confirm && confirm.trim() !== "") {
      errorMessages.push("Confirm Password should not be provided if Password is not set.");
    }
  } else {
    // If password is provided, check if confirm password matches
    if (confirm === undefined || confirm === "") {
      errorMessages.push("Confirm Password is required when setting a new Password.");
    } else if (password !== confirm) {
      errorMessages.push("Password and Confirm Password do not match.");
    }
  }

  // If there are validation errors, re-render the form with error messages
  if (errorMessages.length > 0) {
    // Fetch the existing user to repopulate the form
    const existingUser = await User.findById(userId);
    const roles = await Role.find({ username: { $ne: 'Admin' } });
    return res.render("users/user/user_create_edit", {
      title: "Edit User",
      roles,
      errorMessages,
      user: {
        ...existingUser.toObject(), // Copy existing user details
        username, // Preserve user’s current input
        email,
        role,
        published,
        published_date,
      },
    });
  }

  try {

    // Prepare the update object
    const updateFields = {
      username,
      email,
      role,
      published: published === "on",
      published_date: published_date || Date.now(),
    };

    // Update the password only if it's provided
    if (password && password.trim() !== "") {
      updateFields.password = password; // Include password only if it's set
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true, // Ensure Mongoose validation is still applied
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // Invalidate the cached user list
    await redis.del("/cms/user");

    // Redirect after successful update
    res.redirect("/cms/user");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
//end of cruds for user
//crud for roles
exports.createRole = async (req, res) => {
  try {
    // Extract form data from the request body
    const { name, slug, published } = req.body;

    // Create a new role object
    const newRole = new Role({
      name,
      slug,
      published: published === "on",
    });

    // Save the role to the database
    await newRole.save();

    // Invalidate the cached role list
    await redis.del("/cms/role");

    // Redirect to the role listing page after successful creation
    res.redirect("/cms/role");
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.render("testomonial/testomonial_create_edit", {
        title: "Create Role",
        errorMessages,
        formData: req.body,
        role: null,
      });
    } else {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.roleId);

    if (!role) {
      return res.status(404).send("Role not found");
    }

    // Invalidate the cached role list
    await redis.del("/cms/role");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/role");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Handle updating a role
exports.updateRole = async (req, res) => {
  const roleId = req.params.roleId;
  const { name, slug, published } = req.body;

  // Array to collect validation errors
  const errorMessages = [];

  // Perform manual validation on required fields
  if (!name || name.trim() === "") errorMessages.push("Name is required");
  if (!slug || slug.trim() === "") errorMessages.push("Slug is required");

  // If there are validation errors, re-render the form with error messages
  if (errorMessages.length > 0) {
    // Fetch the existing role to repopulate the form
    const existingRole = await Role.findById(roleId);
    return res.render("users/role/role_create_edit", {
      title: "Edit Role",
      errorMessages,
      role: {
        ...existingRole.toObject(), // Copy existing role details
        name, // Preserve user’s current input
        slug,
        published,
      },
    });
  }

  try {
    // Update the role
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      {
        name,
        slug,
        published: published === "on",
      },
      { new: true, runValidators: true } // Ensure Mongoose validation is still applied
    );

    if (!updatedRole) {
      return res.status(404).send("Role not found");
    }

    // Invalidate the cached role list
    await redis.del("/cms/role");

    // Redirect after successful update
    res.redirect("/cms/role");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};