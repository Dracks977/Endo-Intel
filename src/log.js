module.exports = function(app, path, ejs, fs, users, esso){

	/*
	* Route page d'acceuil
	* redirige les diferent role vers leurs pages
	*/
	app.get('/', function(req, res){
		if (req.session.userinfo) {
			users.findOne({"ID" : req.session.userinfo[1].CharacterID},function(err, ress){
				req.session.db = ress;
				if (ress.role == undefined){
					//ici mettre une page
					res.sendFile(path.resolve(__dirname + '/../public/view/under.html'))
				} else if (ress.role == 0) {
					res.redirect('/submit');
				} else if (ress.role == 1) {
					res.redirect('/intel');
				} else if (ress.role == 2) {
					res.redirect('/admin');
				} else if (ress.role == 3) {
					res.redirect('/admin');
				} else {
					req.session.destroy();
					res.redirect('/');
				}
			})
		} else {
			esso.login(
			{
				client_id: process.env.C_ID,
				client_secret: process.env.C_SECRET,
				redirect_uri:  process.env.CALLBACK
			}, res);
		}
		
	})
	
	/*
	* callback fonction for eve sso
	*/
	app.get('/callback/', function(req, res){
		esso.getTokens({
			client_id: process.env.C_ID,
			client_secret: process.env.C_SECRET
		}, req, res, 
		(accessToken, charToken) => {
			req.session.userinfo = [accessToken, charToken];
			users.update({"ID" : charToken.CharacterID}, {$set:{"ID" : charToken.CharacterID, "Name" : charToken.CharacterName, "date" : Date()}}, { upsert: true },function(err, ress){
				res.redirect('/');
			})
		}
		);
	});

	/*
	* logout
	*/
	app.get('/logout', function(req, res){
		if (req.session.userinfo){
			req.session.destroy();
			res.redirect('/');
		}
		else
			res.redirect('/');
	});

	
}