const Model = require("../models/Model");
const CustomField = require("../models/CustomField");
const StaticPage = require("../models/StaticPage");
const StaticField = require("../models/Fields");
const redis = require("../config/redis");
const validationConfig = require("../config/validationConfig.json");

//view custom-field page
exports.getCustomFieldPage = async (req, res) => {
  const showingpage = "customField";
  if (req.session.user) {
    try {
      const customField = await CustomField.find().populate("model");

      res.render("custom-field/custom-field-list", {
        title: "Custom Field Page",
        customField,
        showingpage
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
      res.render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

//view custom-field Create page
exports.getCustomFieldCreatePage = async (req, res) => {
  const showingpage = "customField";
  if (req.session.user) {
    try {
      const customModels = await Model.find().sort({ name: 1 });
      const staticPage = await StaticPage.find().lean();
      const staticField = await StaticField.find();
      res.render("custom-field/custom-field-create", {
        title: "Custom Field Create Page",
        customModels,
        customField: null,
        staticPage,
        staticField,
        formConfig: validationConfig.field,
        formData: [],
        showingpage
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
      res.render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

exports.getCustomFieldEditPage = async (req, res) => {
  const showingpage = "customField";
  if (req.session.user) {
    try {
      const fieldId = req.params.fieldId;

      const customField = await CustomField.findById(fieldId);

      const customModels = await Model.find().sort({ name: 1 });
      const staticPage = await StaticPage.find().lean();
      const staticField = await StaticField.find();

      res.render("custom-field/custom-field-create", {
        title: "Custom Field Create Page",
        customModels,
        customField,
        staticPage,
        staticField,
        formConfig: validationConfig.field,
        showingpage
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
      res.render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

exports.createOrUpdateCustomField = async (req, res) => {
  try {
    console.log(req.body);

    // Capture the fields from the request body
    const {
      title,
      model,
      target_type,
      label_name,
      field_name,
      parent_id,
      page,
    } = req.body;
    const customFieldId = req.params.fieldId; // For updating

    // Find or create the custom field
    let customField = customFieldId
      ? await CustomField.findById(customFieldId)
      : new CustomField();

    // Update the custom field with the incoming data
    customField.title = title || null;
    customField.model = model ? (Array.isArray(model) ? model : [model]) : []; // Handle model as an array
    customField.target_type = target_type || []; // Ensure target_type is stored as an array
    customField.label_name = label_name || []; // Directly assign label_name as an array
    customField.field_name = field_name || []; // Directly assign field_name as an array
    customField.parent_id = parent_id || null;
    customField.staticId = page || null;

    // Save the custom field
    await customField.save();

    // Fetch updated custom fields list
    const customFields = await CustomField.find().populate("model");

    // Render the custom field list with a success message
    res.render("custom-field/custom-field-list", {
      title: "Custom Field Page",
      message: "Custom field created/updated successfully.",
      customField: customFields,
    });
  } catch (error) {
    console.error("Error while creating/updating custom field:", error);
    res.render("custom-field/custom-field-create", {
      title: "Custom Field Create Page",
      customField: null,
      error: error.message,
    });
  }
};

exports.createCustomField = async (req, res) => {
  try {
    // Check if the submission flag is set in the session
    if (req.session.fieldCreated) {
      // If the flag is set, this means the form was submitted previously
      // So, redirect back to the custom field listing without creating a new field
      return res.redirect("/cms/custom-field");
    }

    // Extract form data from the request body
    const { title, model, target_type, label_name, field_name } = req.body;

    // Create a new custom field object
    const newField = new CustomField({
      title,
      model,
      target_type,
      label_name,
      field_name,
    });

    // Save the custom field to the database
    await newField.save();

    // Invalidate the cached custom field list
    await redis.del("/cms/custom-field");

    // Set the session flag to indicate a field has been created
    req.session.fieldCreated = true;

    // Redirect to the custom field listing page after successful creation
    res.redirect("/cms/custom-field");
  } catch (err) {
    // Reset the flag in case of error to allow future submissions
    req.session.fieldCreated = false;

    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.render("teams/team/team_create_edit", {
        title: "Create Field",
        errorMessages,
        formData: req.body,
        team: null,
      });
    } else {
      console.error(err);
      res.status(500).send("Server Error");
      res.render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } finally {
    // Reset the flag after a brief delay to avoid duplicate submissions
    setTimeout(() => {
      req.session.fieldCreated = false;
    }, 1000); // Adjust the delay as needed
  }
};

exports.deleteField = async (req, res) => {
  try {
    const field = await CustomField.findByIdAndDelete(req.params.customFieldId);

    if (!field) {
      res.render("404", { errorMessages: "File Not Found!", error: "404" });
    }

    // Invalidate the cached field list
    await redis.del("/cms/custom-field");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/custom-field");
  } catch (err) {
    console.error(err);
    res.render("404", {
      errorMessages: "Something is wrong with our side. Please inform us!",
      error: "500",
    });
  }
};

exports.updateTeam = async (req, res) => {
  const teamId = req.params.teamId;
  const {
    name,
    category,
    content,
    email,
    facebook,
    instagram,
    twitter,
    linkedln,
    published,
    published_date,
  } = req.body;

  // Array to collect validation errors
  const errorMessages = [];

  // Perform manual validation on required fields
  if (!name || name.trim() === "") errorMessages.push("Title is required");
  if (!email || email.trim() === "") errorMessages.push("Email is required");
  if (!content || content.trim() === "")
    errorMessages.push("Content is required");
  if (!category || category.length === 0)
    errorMessages.push("At least one category is required");
  if (!author || author.trim() === "") errorMessages.push("Author is required");

  // If there are validation errors, re-render the form with error messages
  if (errorMessages.length > 0) {
    // Fetch the existing team to repopulate the form
    const existingTeam = await Team.findById(teamId);
    return res.render("teams/team/team_create_edit", {
      title: "Edit Team",
      errorMessages,
      team: {
        ...existingTeam.toObject(), // Copy existing team details
        name, // Preserve user’s current input
        email,
        content,
        facebook,
        instagram,
        twitter,
        linkedln,
        published,
        published_date,
      },
    });
  }

  try {
    // Handle featured image update if provided
    const featured_image = req.files["featured_image"]
      ? `/uploads/team/${req.files["featured_image"][0].filename}`
      : req.body.existing_featured_image;

    // Ensure empty values for category and author are not set to old values
    const updatedCategory = category && category.length > 0 ? category : [];

    // Update the team
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        name,
        email,
        content,
        category: updatedCategory, // Ensure empty category doesn't default to old value
        facebook,
        instagram,
        twitter,
        linkedln,
        featured_image,
        published: published === "on",
        published_date: published_date || Date.now(),
      },
      { new: true, runValidators: true } // Ensure Mongoose validation is still applied
    );

    if (!updatedTeam) {
      res.render("404", { errorMessages: "Team not Found!", error: "404" });
    }

    // Invalidate the cached team list
    await redis.del("/cms/team");

    // Redirect after successful update
    res.redirect("/cms/team");
  } catch (err) {
    console.error(err);
    res.render("404", {
      errorMessages: "Something is wrong with our side. Please inform us!",
      error: "500",
    });
  }
};
//end of cruds for custom-field
