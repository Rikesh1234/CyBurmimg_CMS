require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const mailHelper = require("../helper/mailHelper");

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
