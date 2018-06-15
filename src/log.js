module.exports = function(app, path, ejs, fs, users, esso){

	/*
	* Route page d'acceuil
	*/
	app.get('/', function(req, res){
		if (req.session.userinfo) {
 			users.findOne({"ID" : req.session.userinfo[1].CharacterID},function(err, ress){
				req.session.db = ress;
				if (ress.role == undefined){
					res.send("hola ta pas de grade");
				} else if (ress.role == 0) {
					res.redirect('/submit');
				} else if (ress.role == 1) {
					res.send("welcome stratFC");
				} else if (ress.role == 2) {
					res.send("welcome handler");
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
	* callback
	*/
	app.get('/callback/', function(req, res){
		esso.getTokens({
			client_id: process.env.C_ID,
			client_secret: process.env.C_SECRET
		}, req, res, 
		(accessToken, charToken) => {
			req.session.userinfo = [accessToken, charToken];
			// ici si utilisateur autoriser panel sinon attente validation
			users.update({"ID" : charToken.CharacterID}, {$set:{"ID" : charToken.CharacterID, "Name" : charToken.CharacterName, "date" : Date()}}, { upsert: true },function(err, ress){
				res.redirect('/');
			})
		}
		);
	});

	
}