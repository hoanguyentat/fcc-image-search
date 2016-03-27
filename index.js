var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var MONGODB_URI = process.env.MONGOLAB_URI || "mongodb://localhost:27017/testdb";
var PORT = (process.env.PORT || 5000);
var DB = null;

var app = express();

app.use(function (req, res) {
	// TODO: code here
});

MongoClient.connect(MONGODB_URI, function (err, mongodb) {
	if (err) {
		console.error("Error connecting to MongoDB.", err);
		process.exit(1);
	} else {
		DB = mongodb;

		app.listen(PORT, function () {
			console.log('Node app is running on port', PORT);
		});
	}
});
