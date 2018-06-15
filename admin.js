require('dotenv').config();
const MongoClient = require('mongodb').MongoClient
, assert = require('assert'),
ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://'+ process.env.DB_HOST +':'+ process.env.DB_PORT +'/' + process.env.DB_NAME;

MongoClient.connect(url, function(err, client) {
	const db = client.db(process.env.DB_NAME);
	assert.equal(null, err);
	const users = db.collection('users');
	const intel = db.collection('intel');
	users.update({Name : process.argv[2]},{$set : {role: 3}},function(err, ress){
		if (err)
			console.log(err);
		else{
			console.log( process.argv[2] + ' is now admin !')
			process.exit()
		}
	});
})