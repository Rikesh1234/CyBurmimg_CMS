//view custom-field page
exports.getCustomFieldPage=(req,res)=>{
    res.render('custom-field/custom-field-list',{title:'Custom Field Page'});
}

//view custom-field Create page
exports.getCustomFieldCreatePage=(req,res)=>{
    res.render('custom-field/custom-field-create',{title:'Custom Field Create Page'});
}