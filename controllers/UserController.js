const redis = require("../config/redis");
const Role = require("../models/Role");
const User = require("../models/User");

//view user page
exports.getUserPage=(req,res)=>{
    res.render('users/user/user_listing',{title:'User Page'});
}

//view user Create page
exports.getUserCreatePage=(req,res)=>{
    res.render('users/user/user_create_edit',{title:'User Create Page'});
}

//view user Edit page
exports.getUserEditPage=(req,res)=>{
    res.render('users/user/user_create_edit',{title:'User Edit Page'});
}

//view role page
exports.getRolePage=(req,res)=>{
    res.render('users/role/role_listing',{title:'Role Page'});
}

//view role Create page
exports.getRoleCreatePage=(req,res)=>{
    res.render('users/role/role_create_edit',{title:'Role Create Page'});
}

//view role Edit page
exports.getRoleEditPage=(req,res)=>{
    res.render('users/role/role_create_edit',{title:'Role Edit Page'});
}

//view permission page
exports.getPermissionPage=(req,res)=>{
    res.render('users/permission/permission',{title:'Permission Page'});
}

//cruds for users
exports.createUser = [
  async (req, res) => {
    try {
      console.log(req.body)
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("users/user/user_create_edit", {
          title: "Create User",
          errorMessages: errors.array().map(err => err.msg),
          formData: req.body,
          user: null,
          categories,
          authors,
        });
      }

      // Extract form data from the request body
      const {
        name,
        email,
        password,
        confirm,
        published,
        published_date,
      } = req.body;

      // Handle featured image upload
      const featured_image = req.files["featured_image"]
        ? `/uploads/user/${req.files["featured_image"][0].filename}`
        : "/images/default.jpg";
      


      
      
      // Create a new user object
      const newUser = new User({
        name,
        email,
        password,
        published: published === "on",
        published_date: published_date || Date.now(),
        featured_image,
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
  const {
    name,
    email,
    password,
    confirm,
    published,
    published_date,
  } = req.body;

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
    const {
      name,
      slug,
      published,
    } = req.body;

    

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
  const {
    name,
    slug,
    published,
  } = req.body;

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