const express = require("express");
const router = express.Router();
const { getRandomImage } = require("../helper/loginImageHelper");
const User = require("../models/user");

let randomImageUrl = getRandomImage();
//view login page
exports.getLoginPage = (req, res) => {
   randomImageUrl = getRandomImage();
    try {
    if (!req.session.user) {
      res.render("login/login", {
        imageUrl: randomImageUrl,
        title: "Login Page",
      });
    } else {
      res.redirect("/cms/dashboard");
    }
  } catch (error) {
    res.status(500).send("Error occurred: " + error.message);
  }
};

//authentication function
exports.getAuth = async (req, res) => {
  randomImageUrl = getRandomImage();
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
    res.render('login/login', { errorMessage: 'Username not found!', imageUrl: randomImageUrl });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      // Proceed with session handling or token generation
      req.session.user = { username };
      res.redirect("/cms/dashboard");
    } else {
        res.render('login/login', { errorMessage: 'Invalid Password!', imageUrl: randomImageUrl });
    }
  } catch (error) {
    res.render('login/login', { errorMessage: 'Something went wrong', imageUrl: randomImageUrl });
    res.status(500).send('Error logging in: ' + error.message);
  }
};

// Logout route
exports.getLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("cms/dashboard");
    }
    res.clearCookie("connect.sid");
    res.redirect("admin/login");
  });
};

//other APIs ..