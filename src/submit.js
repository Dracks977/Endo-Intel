module.exports = function(app, path, ejs, fs, intel, esso){
	ObjectId = require('mongodb').ObjectID;
	/*
	* Route page spy
	*/
	app.get('/submit', function(req, res){
		if (req.session.db){
			if (req.session.db.role >= 0){
				intel.find({Author: req.session.db.ID.toString()}).toArray(function(err, result) {
					fs.readFile(path.resolve(__dirname + '/../public/view/submitf.html'), 'utf-8', function(err, content) {
						if (err) {
							res.end('error occurred' + err);
							return;
						}
							let renderedHtml = ejs.render(content, {id: req.session.db.ID, name: req.session.db.Name, intel: result, sname: process.env.S_NAME});  //get redered HTML code
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


	app.post('/oprm', (req, res) => {
		if (req.session.db.role >= 0){
			intel.update({_id : ObjectId(req.body._id)},{$set : {deleted : true}},function(err, ress){
				if (err)
					res.send(err);
				else{
					res.sendStatus(200);
				}
			});
		}
	});

	/*
	* Route de ajout intel
	* 
	*/
	app.post('/AddIntel', (req, res, next) => {

		intel.insert(req.body,function(err, ress){
			if (err)
				res.send(err);
			else{
				if (req.session.db.role == 1)
					res.redirect('/submit');
				else
					res.redirect('/intel');
			}
		})	
	});

	/*
	* Route de ajout intel
	* 
	*/
	app.post('/EditIntel', (req, res, next) => {
		if (req.session.db){
			if (req.session.db.role >= 0){
				let request = {"Group":req.body.Group,"Date":req.body.Date,"Type":req.body.Type,"FC":req.body.FC,"Doctrine":req.body.Doctrine,"Comment":req.body.Comment}
				console.log(req.body._id)
				console.log(request)
				intel.update({_id : ObjectId(req.body._id)}, {$set:request},function(err, ress){
					if (err)
						res.send(err);
					else{
						res.redirect('/submit');
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