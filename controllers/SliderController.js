//view slider page
exports.getSliderPage=(req,res)=>{
    res.render('slider/slider_listing',{title:'Slider Page'});
}

//view slider Create page
exports.getSliderCreatePage=(req,res)=>{
    res.render('slider/slider_create_edit',{title:'Slider Create Page'});
}

//view slider Edit page
exports.getSliderEditPage=(req,res)=>{
    res.render('slider/slider_create_edit',{title:'Slider Edit Page'});
}