var express = require('express');
var fs = require("fs")
var Bing = require('node-bing-api')({accKey: "f1137250d0cc45ee89fb0b323bbe41e0"});
var MongoClient = require('mongodb').MongoClient;

var MONGODB_URI = process.env.MONGOLAB_URI || "mongodb://kevinhoa95:HolaNguyen1995@ds159348.mlab.com:59348/image";
var PORT = (process.env.PORT || 5000);
var searches = null;

var app = express();

app.get("/", function(req, response) {
    fs.readFile("index.html", function(err, data){
       if(err){
          response.writeHead(404);
          response.write("Not Found!");
       }
       else{
          response.writeHead(200, {'Content-Type': "text/html"});
          response.write(data);
       }
       response.end();
    })
})
app.get("/api/imagesearch/:search", function (req, res) {
	var search = req.params.search;

	// save search in database
	var term = decodeURIComponent(search);
	var when = new Date();
	searches.insert({term: term, when: when});

	// get 10 images with api
	var offset = req.query.offset || 0;

	Bing.images(term, {top: 10, skip: offset}, function (err, response, body) {
		if (err) {
			console.error(err);
			return res.status(500).end(err.message);
		}
		res.json(body.d.results.map(function (el) {
			return {
				alt: el.Title,
				page: el.SourceUrl,
				image: el.MediaUrl
			};
		}));
	});
});

app.get("/api/latest/imagesearch/", function (req, res) {
	//TODO: get last 10 searches
	searches.find().limit(10).sort({when: -1}).toArray(function (err, results) {
		if (err) {
			console.error(err);
			return res.status(500).end(err.message);
		}
		res.json(results.map(function (el) {
			return {
				term: el.term,
				when: el.when
			};
		}));
	});
});

app.get("*", function (req, res) {
	res.status(404).end("Error 404: '" + req.path + "' Not Found");
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
