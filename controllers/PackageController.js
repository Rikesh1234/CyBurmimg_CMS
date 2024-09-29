//view package page
exports.getPackagePage=(req,res)=>{
    res.render('package/package_listing',{title:'package Page'});
}

//view package Create page
exports.getPackageCreatePage=(req,res)=>{
    res.render('package/package_create_edit',{title:'package Create Page'});
}

//view package Edit page
exports.getPackageEditPage=(req,res)=>{
    res.render('package/package_create_edit',{title:'package Edit Page'});
}