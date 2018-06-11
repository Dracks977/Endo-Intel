module.exports = function(app, path, ejs, fs, intel, esso){

	/*
	* Route page spy
	*/
	app.get('/submit', function(req, res){
		if (req.session.db){
			if (req.session.db.role >= 0){
				console.log(req.session.db.ID)
				intel.find({Author: req.session.db.ID.toString()}).toArray(function(err, result) {
					fs.readFile(path.resolve(__dirname + '/../public/view/submitf.html'), 'utf-8', function(err, content) {
						if (err) {
							res.end('error occurred' + err);
							return;
						}
							console.log(result);
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
	* Route de ajout intel
	* 
	*/
	app.post('/AddIntel', (req, res, next) => {

		intel.insert(req.body,function(err, ress){
			if (err)
				res.send(err);
			else{
				res.redirect('/submit');
				console.log(ress);
			}
		})	
	});

}