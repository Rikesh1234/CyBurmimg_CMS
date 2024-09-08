//view parnters page
exports.getPartnerPage=(req,res)=>{
    res.render('partners/partner_listing',{title:'Partner Page'});
}

//view parnters Create page
exports.getPartnerCreatePage=(req,res)=>{
    res.render('partners/partner_create_edit',{title:'Partner Create Page'});
}

//view parnters Edit page
exports.getPartnerEditPage=(req,res)=>{
    res.render('partners/partner_create_edit',{title:'Partner Edit Page'});
}