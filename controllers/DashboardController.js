//view dashboard page
exports.getPage=(req,res)=>{
    if (req.session.user) {
        res.render('dashboard/dashboard',{title:'Dashboard Page'});
    } else {
        res.redirect('/admin/login');
    }
}

//other APIs ..
