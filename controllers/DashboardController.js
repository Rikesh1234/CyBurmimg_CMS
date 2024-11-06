const Post = require("../models/Post");
const Team = require("../models/Team");
const Package = require("../models/Package");
const User = require("../models/user");

//view dashboard page
exports.getPage= async (req,res)=>{
    if (req.session.user) {
        const showingpage = "dashboard";
        const packagesCount = await Package.countDocuments();
        const teamCount = await Team.countDocuments();
        const postCount = await Post.countDocuments();
        
        const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
        let users = await User.find().populate('role');

// Filter out users whose role is Admin
     users = users.filter(user => user.role.name !== 'Admin');

        res.render('dashboard/dashboard',{title:'Dashboard Page', packagesCount, teamCount, postCount, posts, users, showingpage});
    } else {
        res.render('404',{errorMessages:"Looks Like you are lost!",error:"404"});
    }
}

//other APIs ..