const express = require('express');
const router = express.Router();

router.get('/find', function(req, res, next) {

	db.collection('example')
		.find({})
		.toArray(function(err, result) {
			res.send(result);
		})

});

router.post('/login', function(req, res) {

});

router.post('/register', function(req, res) {
	const db = process.dbObject;
	const col = db.collection('users');
	col.insertOne({
			emailId,
			password,
			firstName,
			lastName,
			phoneNumber
		} = req.body)
		.then((r, err) => {
			if (err) {
				return res.send(err);
			}
			return res.send(r);
		})
		.catch(err => {
			return res.send(err);
		})
})

module.exports = router;