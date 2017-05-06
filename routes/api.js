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

router.post('/login', auth.loginUser);

router.post('/register',auth.registerUserSocial, auth.registerUserLocal);

router.post('/logout', auth.logoutUser);

module.exports = router;