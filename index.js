var express = require('express');
var request = require('request');
var MongoClient = require('mongodb').MongoClient;

var MONGODB_URI = process.env.MONGOLAB_URI || "mongodb://localhost:27017/test";
var PORT = (process.env.PORT || 5000);
var API_KEY = process.env.API_KEY;
var API_URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=";
var searches = null;

var app = express();

app.get("/api/imagesearch/:search", function (req, res) {
	// save search in database
	var term = decodeURIComponent(req.params.search);
	var when = new Date();
	searches.insert({term: term, when: when});

	// get 10 images with api
	var url = API_URL + req.params.search;
	request({
		url: url,
		json: true
	}, function (err, res2, body) {
		res.json(body);//TODO: test this
	});
});

app.get("/api/latest/imagesearch/", function (req, res) {
	//TODO: get last 10 searches
	searches.find().limit(10).sort({when: -1}).toArray(function (err, results) {
		if (err) {
			console.error(err);
			return res.status(500).end(err.message);
		}
		res.json(results);
	});
});

app.get(function (req, res) {
	res.status(404).end("Error 404:" + req.path + " Not Found");
});

MongoClient.connect(MONGODB_URI, function (err, mongodb) {
	if (err) {
		console.error("Error connecting to MongoDB.", err);
		process.exit(1);
	} else {
		searches = mongodb.collection("searches");

		app.listen(PORT, function () {
			console.log('Node app is running on port', PORT);
		});
	}
});
