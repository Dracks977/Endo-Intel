module.exports = function(app, path, ejs, fs, users, esso){

	/*
	* Route page admin
	*/
	app.get('/admin', function(req, res){
		if (req.session.db){
			if (req.session.db.role == 3){

				users.find({}).toArray(function(err, result) {
					console.dir(result);
					fs.readFile(path.resolve(__dirname + '/../public/view/admin.html'), 'utf-8', function(err, content) {
						if (err) {
							res.end('error occurred' + err);
							return;
						} 
   						let renderedHtml = ejs.render(content, {users: result});  //get redered HTML code
   						res.end(renderedHtml);
   					});
				});

			} else {
				res.redirect('/');
			}
		} else {
			res.redirect('/');
		}
	})


	/*
	* Edit membres
	*/
	app.post('/RoleM', (req, res) => {
		if (req.session.db.role == 3){
		let request = {handler: req.body.handler, role: req.body.role }
		users.update({ID : parseInt(req.body.ID)},{$set : request},function(err, ress){
			if (err)
				res.send(err);
			else{
				res.redirect('/admin');
			}
		});
	} else {
		res.redirect('/');
	}	
	});
	
}