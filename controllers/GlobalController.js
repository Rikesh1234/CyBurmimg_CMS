//view setting page
exports.getSettingPage=(req,res)=>{
    res.render('setting/setting_listing',{title:'Setting Page'});
}

//view setting Create page
exports.getSettingCreatePage=(req,res)=>{
    res.render('setting/setting_create_edit',{title:'Setting Create Page'});
}