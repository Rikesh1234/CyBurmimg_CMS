const Team = require("../models/Team");
const redis = require("../config/redis");
const validationConfig = require('../config/validationConfig.json');
const CustomField = require("../models/CustomField");


const getPostValidationRules = () => {
  const rules = [];


  if (validationConfig.team.memberType) {
    rules.push(body('memberType').notEmpty().withMessage('Team type is required'));
  }
  return rules;
};


//view member page
exports.getTeamPage= async (req,res)=>{
    try{
      const showingpage = "team";
      // Fetch all team from the database
      const teams= await Team.find();

      //Render the view and pass the users to the EJS template
      res.render('teams/team/team_listing',{title:'Team Page', teams,showingpage});
    }catch (err) {
      console.error(err);
      res.status(500).render('404',{title:'Internal Server Error',error:'500',errorMessages:'Something is wrong in the server'})
    }
  }

//view member Create page
exports.getTeamCreatePage = async (req, res) => {
  const showingpage = "team";
  let customField = await CustomField.find()
  .populate({
    path: 'model',  // Populate the 'model' field
    match: { path: '../models/Team' } // Filter to only include models with the specified path
  })
  .populate({
    path: 'target_type', // Populate the 'field' field
  });

  res.render('teams/team/team_create_edit', {
      title: 'Team Create Page',
      team: null,
      errorMessages: [],
      formConfig:validationConfig.team,
      customField,
      showingpage
  });
};


//view member Edit page
exports.getTeamEditPage = async (req, res) => {
  try {
    const showingpage = "team";
    let customField = await CustomField.find()
  .populate({
    path: 'model',  // Populate the 'model' field
    match: { path: '../models/Team' } // Filter to only include models with the specified path
  })
  .populate({
    path: 'target_type', // Populate the 'field' field
  });

      const teamId = req.params.teamId; // Use the correct parameter name from the route
      // Fetch the existing team
      const team = await Team.findById(teamId);

      // If team not found, return a 404 status
      if (!team) {
          return res.status(404).send("Team not found");
      }

      // Render the edit form with the existing team data
      res.render('teams/team/team_create_edit', {
          title: 'Team Edit Page',
          team, 
          errorMessages: [],
          formConfig:validationConfig.team,
          customField,
          showingpage

      });
  } catch (err) {
      console.error(err);
      res.status(500).render('404',{title:'Internal Server Error',error:'500',errorMessages:'Something is wrong in the server'})
  }
};


//view member-type page
exports.getTeamTypePage=(req,res)=>{
  const showingpage = "team";
    res.render('teams/memberType/memberType_listing',{title:'Team Type Page', showingpage});
}

//view member-type Create page
exports.getTeamTypeCreatePage=(req,res)=>{
  const showingpage = "team";
    res.render('teams/memberType/memberType_create_edit',{title:'Team Type Create Page',formConfig: validationConfig.team, showingpage});
}

//view member-type Edit page
exports.getTeamTypeEditPage=(req,res)=>{
  const showingpage = "team";
    res.render('teams/memberType/memberType_create_edit',{title:'Team Type Edit Page',formConfig: validationConfig.team,showingpage});
}


//cruds for team
exports.createTeam = async (req, res) => {
  try {
    // Extract form data from the request body
    const {
      name,
      designation,
      content,
      category,
      email,
      facebook,
      instagram,
      twitter,
      linkedin,
      published,
      published_date,
    } = req.body;

    
    // Handle featured image upload
    const featured_image = req.files["team_image"]
      ? `/uploads/teams/${req.files["team_image"][0].filename}`
      : "/images/default.jpg";

    
    // Create a new team object
    const newTeam = new Team({
      name,
      designation,
      content,
      category,
      email,
      facebook,
      instagram,
      twitter,
      linkedin,
      published: published === "on",
      published_date: published_date || Date.now(),
      featured_image,
    });

    // Save the team to the database
    await newTeam.save();

    // Invalidate the cached team list
    await redis.del("/cms/team");

    // Redirect to the team listing page after successful creation
    res.redirect("/cms/team");
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.render("teams/team/team_create_edit", {
        title: "Create Team",
        errorMessages,
        formData: req.body,
        team: null,
      });
    } else {
      console.error(err);
      res.status(500).render('404',{title:'Internal Server Error',error:'500',errorMessages:'Something is wrong in the server'})
    }
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.teamId);

    if (!team) {
      return res.status(404).send("Team not found");
    }

    // Invalidate the cached team list
    await redis.del("/cms/team");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/team");
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
    linkedin,
    published,
    published_date,
  } = req.body;

  // Array to collect validation errors
  const errorMessages = [];

  // Perform manual validation on required fields
  if (!name || name.trim() === "") errorMessages.push("Title is required");
  if (!email || email.trim() === "") errorMessages.push("Email is required");
  // if (!content || content.trim() === "")
  //   errorMessages.push("Content is required");
  // if (!category || category.length === 0)
  //   errorMessages.push("At least one category is required");
  // if (!author || author.trim() === "") errorMessages.push("Author is required");

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
        linkedin,
        published,
        published_date,
      },
    });
  }

  try {
    // Handle featured image update if provided
    const featured_image = req.files["team_image"]
      ? `/uploads/teams/${req.files["team_image"][0].filename}`
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
        linkedin,
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

//end of cruds for team