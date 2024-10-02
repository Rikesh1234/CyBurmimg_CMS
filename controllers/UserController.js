const redis = require("../config/redis");
const Role = require("../models/Role");
const User = require("../models/user");
const Permission = require("../models/Permission");
const Model = require("../models/Model");

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

    const users = await User.find();

    //Render the view and pass the users to the EJS template
    res.render("users/user/user_listing", { title: "User Page", users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//view user Create page
exports.getUserCreatePage = async (req, res) => {
  const activeRoles = await Role.find();
  console.log(activeRoles);

  console.log(activeRoles);
  res.render("users/user/user_create_edit", {
    title: "User Create Page",
    user: null,
    errorMessages: [],
    roles: activeRoles,
  });
};

//view user Edit page
exports.getUserEditPage = async (req, res) => {
  try {
    // Get the user ID from the request params
    const userId = req.params.userId;

    // Fetch all active roles for the dropdown
    const activeRoles = await Role.find();

    // Fetch the user from the database, including their role
    const user = await User.findById(userId).populate('role');

    // If user not found, return a 404 error
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Render the edit view with the fetched user data and available roles
    res.render("users/user/user_create_edit", {
      title: "User Edit Page",
      user: user, // Pass the user object
      errorMessages: [],
      roles: activeRoles // Pass roles for the dropdown
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//view role page
exports.getRolePage = async (req, res) => {
  {
    // Fetch all roles from the database
    const roles = await Role.find();

      //Render the view and pass the users to the EJS template
      res.render('users/role/role_listing',{title:'Role Page', roles});
    }catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
}

//view role Create page
exports.getRoleCreatePage = (req, res) => {
  res.render("users/role/role_create_edit", {
    title: "Role Create Page",
    role: null,
    errorMessages: [],
  });
};

//view role Edit page
exports.getRoleEditPage = async (req, res) => {
  try {
    // Find the role by its ID
    const role = await Role.findById(req.params.roleId);

    if (!role) {
      return res.status(404).send("Role not found");
    }

    // Render the edit page with the existing role data
    res.render("users/role/role_create_edit", {
      title: "Role Edit Page",
      role, // Pass the role object to the template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//cruds for users
exports.createUser = [
  async (req, res) => {
    try {
      console.log(req.body);
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("users/user/user_create_edit", {
          title: "Create User",
          errorMessages: errors.array().map((err) => err.msg),
          formData: req.body,
          user: null,
          categories,
          authors,
        });
      }

      // Extract form data from the request body
      const {
        username,
        email,
        password,
        confirm,
        role,
        published,
        published_date,
      } = req.body;

      // Handle featured image upload
      // const featured_image = req.files["user_image"]
      //   ? `/uploads/user/${req.files["user_image"][0].filename}`
      //   : "/images/default.jpg";

      // Create a new user object
      const newUser = new User({
        username, // Include username
        email,
        password,
        role, // Include role
        published: published === "on",
        published_date: published_date || Date.now(),
        // featured_image,
      });

      // Save the user to the database
      await newUser.save();

      // Invalidate the cached user list
      await redis.del("/cms/user");

      // Redirect to the user listing page after successful creation
      res.redirect("/cms/user");
    } catch (err) {
      console.error(err);

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
  const { name, email, password, confirm, published, published_date } =
    req.body;

  // Array to collect validation errors
  const errorMessages = [];

  // Perform manual validation on required fields
  if (!name || name.trim() === "") errorMessages.push("Name is required");
  if (!email || email.trim() === "") errorMessages.push("Email is required");
  if (!password) errorMessages.push("Password is required");
  if (!confirm) errorMessages.push("Confirm Password is required");

  // If there are validation errors, re-render the form with error messages
  if (errorMessages.length > 0) {
    // Fetch the existing user to repopulate the form
    const existingUser = await User.findById(userId);
    return res.render("users/user/user_create_edit", {
      title: "Edit User",
      errorMessages,
      user: {
        ...existingUser.toObject(), // Copy existing user details
        name, // Preserve user’s current input
        email,
        published,
        published_date,
      },
    });
  }

  try {
    // Handle featured image update if provided
    const featured_image = req.files["featured_image"]
      ? `/uploads/user/${req.files["featured_image"][0].filename}`
      : req.body.existing_featured_image;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        password,
        featured_image,
        published: published === "on",
        published_date: published_date || Date.now(),
      },
      { new: true, runValidators: true } // Ensure Mongoose validation is still applied
    );

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
