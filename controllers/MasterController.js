require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const mailHelper = require("../helper/mailHelper");
const User = require("../models/user");
const CustomField = require("../models/CustomField");

exports.sendInquiries = async (req, res) => {
  const from = {
    address: "no-reply@goodwill-cleaning.com",
    name: "Goodwill Cleaning",
  };
  const to = ["obitorin36@gmail.com"];
  const subject = "Customer Inquiry";
  console.log(req.body);
  // Render the EJS template and pass data
  const html = await ejs.renderFile(
    path.join(
      __dirname,
      "../views/theme/" + process.env.THEME + "/mail/mail.ejs"
    ),
    {
      p_name: req.body.p_name ?? null,
      name: req.body.name ?? null,
      phone: req.body.phone ?? null,
      email: req.body.email ?? null,
      address: req.body.address ?? null,
      message: req.body.message ?? null,
      mail_title: "Feedback Mail",

      // Any other dynamic data you want to pass
    }
  );
  try {
    await mailHelper.sendEmail(from, to, subject, html);
    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.log(error);

    // Send error response for AJAX
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
    });
  }
};

exports.bookOrder = async (req, res) => {
  const from = {
    address: "no-reply@goodwill-cleaning.com",
    name: "Goodwill Cleaning",
  };
  const to = ["obitorin36@gmail.com"];
  const subject = "Customer Order";
  console.log(req.body);
  // Render the EJS template and pass data
  const html = await ejs.renderFile(
    path.join(
      __dirname,
      "../views/theme/" + process.env.THEME + "/mail/mail.ejs"
    ),
    {
      p_name: req.body.p_name ?? null,
      name: req.body.name ?? null,
      phone: req.body.phone ?? null,
      email: req.body.email ?? null,
      address: req.body.address ?? null,
      message: req.body.message ?? null,
      mail_title: "Feedback Mail",

      // Any other dynamic data you want to pass
    }
  );
  try {
    await mailHelper.sendEmail(from, to, subject, html);
    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.log(error);

    // Send error response for AJAX
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
    });
  }
};

exports.getLoginUserData = async (req, res) => {
  try {
    // Fetch custom fields and populate 'model' and 'target_type' references
    const customField = await CustomField.find()
      .populate({
        path: 'model',  // Populate the 'model' field
        match: { path: '../models/user' }, // Ensure this matches your actual schema structure
      })
      .populate({
        path: 'target_type', // Populate the 'target_type' field
      });

    // Get the username from the session
    const username = req.session.user.username;

    console.log(username);

    // Fetch the user by username
    const user = await User.findOne({ username });

    // If user not found, return a 404 error
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Render the edit view with the fetched user data and custom fields
    res.render("users/user/user_create_edit", {
      title: "User Edit Page",
      user, // Pass the user object
      errorMessages: [],
      customField,
      selfUser: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

