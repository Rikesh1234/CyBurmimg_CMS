//view member page
exports.getTeamPage=(req,res)=>{
    res.render('teams/team/team_listing',{title:'Team Page'});
}

//view member Create page
exports.getTeamCreatePage=(req,res)=>{
    res.render('teams/team/team_create_edit',{title:'Team Create Page'});
}

//view member Edit page
exports.getTeamEditPage=(req,res)=>{
    res.render('teams/team/team_create_edit',{title:'Team Edit Page'});
}

//view member-type page
exports.getTeamTypePage=(req,res)=>{
    res.render('teams/memberType/memberType_listing',{title:'Team Type Page'});
}

//view member-type Create page
exports.getTeamTypeCreatePage=(req,res)=>{
    res.render('teams/memberType/memberType_create_edit',{title:'Team Type Create Page'});
}

//view member-type Edit page
exports.getTeamTypeEditPage=(req,res)=>{
    res.render('teams/memberType/memberType_create_edit',{title:'Team Type Edit Page'});
}