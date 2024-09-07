//view testomonial page
exports.getTestomonialPage=(req,res)=>{
    res.render('testomonial/testomonial_listing',{title:'Testomonial Page'});
}

//view testomonial Create page
exports.getTestomonialCreatePage=(req,res)=>{
    res.render('testomonial/testomonial_create_edit',{title:'Testomonial Create Page'});
}

//view testomonial Edit page
exports.getTestomonialEditPage=(req,res)=>{
    res.render('testomonial/testomonial_create_edit',{title:'Testomonial Edit Page'});
}