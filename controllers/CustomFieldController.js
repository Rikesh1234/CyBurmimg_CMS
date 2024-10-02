const CustomField = require("../models/CustomField");
const redis = require("../config/redis");

//view custom-field page
exports.getCustomFieldPage=(req,res)=>{
    res.render('custom-field/custom-field-list',{title:'Custom Field Page'});
}

//view custom-field Create page
exports.getCustomFieldCreatePage=(req,res)=>{
    res.render('custom-field/custom-field-create',{title:'Custom Field Create Page'});
}

//crudsfor custom-field
exports.createCustomField = async (req, res) => {
  try {
    // Extract form data from the request body
    const {
      title,
      model,
      target_type,
      label_name,
      field_name,
    } = req.body;

    

    
    // Create a new team object
    const newField = new CustomField({
      title,
      model,
      target_type,
      label_name,
      field_name,
    });

    // Save the team to the database
    await newField.save();

    // Invalidate the cached team list
    await redis.del("/cms/custom-field");

    // Redirect to the team listing page after successful creation
    res.redirect("/cms/custom-field");
  } catch (err) {
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
    }
  }
};

exports.deleteField = async (req, res) => {
  try {
    const field = await CustomField.findByIdAndDelete(req.params.customFieldId);

    if (!field) {
      return res.status(404).send("Field not found");
    }

    // Invalidate the cached field list
    await redis.del("/cms/custom-field");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/cusom-field");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
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
      return res.status(404).send("Team not found");
    }

    // Invalidate the cached team list
    await redis.del("/cms/team");

    // Redirect after successful update
    res.redirect("/cms/team");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
//end of cruds for custom-field