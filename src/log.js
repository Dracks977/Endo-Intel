module.exports = function(app, path, ejs, fs, users, esso){

	/*
	* Route page d'acceuil
	*/
	app.get('/', function(req, res){
		if (req.session.userinfo) {
			console.log(req.session.userinfo[1].CharacterID)
			users.findOne({"ID" : req.session.userinfo[1].CharacterID},function(err, ress){
				console.log(ress)
				req.session.db = ress;
				if (ress.role == undefined){
					res.send("hola ta pas de grade");
				} else if (ress.role == 0) {
					res.send("welcome spy");
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
				client_id: 'bbf65f4885be41138e8369efb630f04b',
				client_secret: 'ZCHdqUuyNqroVPo7vTdvF8dVLUghrVzZSQ6oFVze',
				redirect_uri: 'http://localhost/callback/'
			}, res);
		}
		
	})
	
	/*
	* callback
	*/
	app.get('/callback/', function(req, res){
		esso.getTokens({
			client_id: 'bbf65f4885be41138e8369efb630f04b',
			client_secret: 'ZCHdqUuyNqroVPo7vTdvF8dVLUghrVzZSQ6oFVze'
		}, req, res, 
		(accessToken, charToken) => {
			req.session.userinfo = [accessToken, charToken];
			// ici si utilisateur autoriser panel sinon attente validation
			users.update({"ID" : charToken.CharacterID}, {$set:{"ID" : charToken.CharacterID, "Name" : charToken.CharacterName, "date" : Date()}}, { upsert: true },function(err, ress){
				console.log(ress.result);
				res.redirect('/');
			})
		}
		);
	});

	
}