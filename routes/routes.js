const express=require('express');
const router=express.Router();
const homeController= require('../controllers/HomeController');
const dashboardController= require('../controllers/DashboardController');




router.get('/',homeController.getPage);
router.get('/dashboard',dashboardController.getPage);


// router.use((req,res)=>{
//     res.status(404).render('404',{title:'Page Not Found'});
// });


module.exports =router;