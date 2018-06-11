/*=====================Initialisation=====================*/
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
const url = 'mongodb://localhost:27017/ENDO';
const esso = require('eve-sso-simple');
/*======================================================*/

// Middleware session
app.engine('html', require('ejs').renderFile);

app.use(session(
{
	secret: 'eenvdeo',
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
	const db = client.db('ENDO');
	assert.equal(null, err);
	const users = db.collection('users');
	const intel = db.collection('intel');
	/*------include fichier------*/
	require('./src/log.js')(app, path, ejs, fs, users, esso);
	require('./src/admin.js')(app, path, ejs, fs, users, esso, intel);
	require('./src/submit.js')(app, path, ejs, fs, intel, esso);
})

/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/webfonts", express.static(__dirname + '/public/webfonts'));



/*==================start serv==================*/
http.listen(80, function(){
	console.log('listening on *:80');
});