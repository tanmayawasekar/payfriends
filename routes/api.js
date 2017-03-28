const express = require('express');
const router = express.Router();
const auth = require('../controlers/auth');

router.get('/find', function(req, res, next) {

	db.collection('example')
		.find({})
		.toArray(function(err, result) {
			res.send(result);
		})

});

router.post('/login', function(req, res) {

});

router.post('/register', auth.registerUser);

module.exports = router;