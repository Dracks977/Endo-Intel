module.exports = function(app, path, ejs, fs, users, esso, intel){
	ObjectId = require('mongodb').ObjectID;
	/*
	* Route page admin
	*/
	app.get('/admin', function(req, res){
		if (req.session.db){
			if (req.session.db.role == 3){

				users.find({}).toArray(function(err, result) {
					fs.readFile(path.resolve(__dirname + '/../public/view/admin.html'), 'utf-8', function(err, content) {
						if (err) {
							res.end('error occurred' + err);
							return;
						} 
   						let renderedHtml = ejs.render(content, {users: result, name: req.session.db.Name});  //get redered HTML code
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
	* Route page intel
	*/
	app.get('/intel', function(req, res){
		if (req.session.db){
			if (req.session.db.role == 3){
				intel.find().toArray(function(err, result) {
					fs.readFile(path.resolve(__dirname + '/../public/view/intel.html'), 'utf-8', function(err, content) {
						if (err) {
							res.end('error occurred' + err);
							return;
						}
							let renderedHtml = ejs.render(content, {id: req.session.db.ID, name: req.session.db.Name, intel: result});  //get redered HTML code
							res.end(renderedHtml);
						});
				})
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

	/*
	* Route de edit intel
	* 
	*/
	app.post('/AEditIntel', (req, res, next) => {
		if (req.session.db){
			if (req.session.db.role == 3){
				let request = {"Group":req.body.Group,"Date":req.body.Date,"Type":req.body.Type,"FC":req.body.FC,"Doctrine":req.body.Doctrine,"Comment":req.body.Comment}
				console.log(req.body._id)
				console.log(request)
				intel.update({_id : ObjectId(req.body._id)}, {$set:request},function(err, ress){
					if (err)
						res.send(err);
					else{
						res.redirect('/intel');
					}
				})	
			} else {
				res.redirect('/');
			}
		} else {
			res.redirect('/');
		}
	});
	
}