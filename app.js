/*=====================Initialisation=====================*/
require('dotenv').config();
const express   =     require("express");
const app       =     express();
const http = require('http').Server(app);
const httpd = require('https');
const fs = require('fs');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const MongoClient = require('mongodb').MongoClient
, assert = require('assert'),
ObjectID = require('mongodb').ObjectID;
const path = require('path');
const session = require('express-session');
const url = 'mongodb://'+ process.env.DB_HOST +':'+ process.env.DB_PORT +'/' + process.env.DB_NAME;
const esso = require('eve-sso-simple');
var schedule = require('node-schedule');
const moment = require('moment');
/*======================================================*/

// Middleware session
app.engine('html', require('ejs').renderFile);

app.use(session(
{
	secret: process.env.COOKIE,
	saveUninitialized: false,
	resave: false
}
));

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

/*======================routes==========================*/ 
MongoClient.connect(url, function(err, client) {
	const db = client.db(process.env.DB_NAME);
	assert.equal(null, err);
	const users = db.collection('users');
	const intel = db.collection('intel');
	/*------include fichier------*/
	require('./src/log.js')(app, path, ejs, fs, users, esso);
	require('./src/admin.js')(app, path, ejs, fs, users, esso, intel);
	require('./src/submit.js')(app, path, ejs, fs, intel, esso);

	var j = schedule.scheduleJob('*/30 * * * *', function(){
			var now = moment().add(4, 'h');;

		intel.find({deleted: {$ne: true}}).toArray(function(err, result) {
			result.forEach(function(element) {
				var date = moment(element.Date)
				if (moment(date).isBefore(now)){
					intel.update({_id : ObjectId(element._id)}, {$set:{deleted : true}},function(err, ress){
						if (err)
							console.log(err)
						else{
							console.log("====> achived : " + element._id);
						}
					})	
				}
			});
		})
	});
})

/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/webfonts", express.static(__dirname + '/public/webfonts'));



/*==================start serv==================*/
http.listen(process.env.PORT, function(){
	console.log('listening on *:' + process.env.PORT);
});