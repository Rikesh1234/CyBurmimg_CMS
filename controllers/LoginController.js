const express = require('express');
const router = express.Router();
const { getRandomImage } = require('../helper/loginImageHelper');
const User = require('../models/user');


//view login page
exports.getLoginPage=(req,res)=>{
    try {
        if (!req.session.user) {
            const randomImageUrl = getRandomImage();
        res.render('login/login', { imageUrl: randomImageUrl, title:'Login Page' });
        } else {
            res.redirect('/cms/dashboard');
        }
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

//authentication function
exports.getAuth=async (req,res)=>{
    const { username, password } = req.body;
    try{ 
    const user = await User.findOne({ username });
    if (!user) {
        console.log('User not found');
        return;
    }

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
        console.log('Login successful!');
        // Proceed with session handling or token generation
        console.log('Setting session for user:', username);
req.session.user = { username };
console.log('Session set:', req.session.user);
        res.redirect('/cms/dashboard');
    } else {
        console.log('Invalid password');
    }
} catch (error) {
    console.error('Error logging in:', error.message);
}
}

// Logout route
exports.getLogout=async (req,res)=>{
    req.session.destroy(err => {
        if (err) {
            return res.redirect('cms/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('admin/login');
    });
}

//other APIs ..
