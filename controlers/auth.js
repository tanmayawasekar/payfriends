const userOperations = require('../models/users');

const cryptography = require('../helpers/crytography');

const utils = require('../helpers/utils');

const jwt = require('jsonwebtoken');

module.exports = {
	registerUserLocal(req, res, next) {
		utils.checkIfRequiredFieldsExists({
				'objectToCheckIn': req.body,
				'requiredFields': userOperations.requireFields,
				'errMessage': 'Bad Request'
			})
			.then(result => userOperations.addOne(req.body))
			.then((user, err) => {
				if (err) {
					return res.send(err);
				}
				return res.send(user);
			})
			.catch(err => {
				return next(err);
			});
	},
	loginUser(req, res, next) {

		utils.checkIfRequiredFieldsExists({
				'objectToCheckIn': req.body,
				'requiredFields': userOperations.requireFields,
				'errMessage': 'Bad Request',
				'ignoreFields': !req.body.emaildId ? 'emailId' : !req.body.phoneNumber ? 'phoneNumber' : ''
			})
			.then(result => userOperations.checkIfUserExists(req.body))
			.then(user => utils.checkIfDataExists(user, 'Invalid Credentials'))
			.then(user => Object.assign(req, {
				'user': user
			}))
			.then(({
				user
			}) => cryptography.comparePassword(req.body.password, user.password))
			.then(result => utils.checkIfDataExists(result, 'Invalid Credentials'))
			.then(result =>{
				 res.setHeader('X-Authorization', jwt.sign({
					'emaildId': req.user.emailId
				}, process.jwt.key, {
					'expiresIn': process.jwt.expirationTime
				}));})
			.then(result => utils.sendResponseIfTrue({
				'condition': true,
				'valueToSend': req.user,
				'responseObject': res,
				'errMessage': 'Invalid Credentials'
			}))
			.catch(err => next(err));

	}
};
