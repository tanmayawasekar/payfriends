const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/gg';

process.db = MongoClient.connect(url);//To be used for non-controllers

process.db.then((db, err) => {
	console.log('Connected to database');
	process.dbObject = db;//To be used for controllers directly
})
