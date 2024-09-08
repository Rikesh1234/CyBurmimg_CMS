//view user page
exports.getUserPage=(req,res)=>{
    res.render('users/user/user_listing',{title:'User Page'});
}

//view user Create page
exports.getUserCreatePage=(req,res)=>{
    res.render('users/user/user_create_edit',{title:'User Create Page'});
}

//view user Edit page
exports.getUserEditPage=(req,res)=>{
    res.render('users/user/user_create_edit',{title:'User Edit Page'});
}

//view role page
exports.getRolePage=(req,res)=>{
    res.render('users/role/role_listing',{title:'Role Page'});
}

//view role Create page
exports.getRoleCreatePage=(req,res)=>{
    res.render('users/role/role_create_edit',{title:'Role Create Page'});
}

//view role Edit page
exports.getRoleEditPage=(req,res)=>{
    res.render('users/role/role_create_edit',{title:'Role Edit Page'});
}

//view permission page
exports.getPermissionPage=(req,res)=>{
    res.render('users/permission/permission',{title:'Permission Page'});
}