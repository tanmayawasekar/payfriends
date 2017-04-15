const userOperations = require('../models/users');

const cryptography = require('../helpers/crytography');

const utils = require('../helpers/utils');

const jwt = require('jsonwebtoken');

module.exports = {
	registerUserLocal(req, res, next) {
		utils.checkIfRequiredFieldsExists({
				'objectToCheckIn': req.body,
				'requiredFields': userOperations.requireFields,
				'errMessage': 'Bad Request',
				next
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
				'ignoreFields': !req.body.emaildId ? 'emailId' : !req.body.phoneNumber ? 'phoneNumber' : '',
				next
			})
			.then(result => userOperations.checkIfUserExists(req.body, next))
			.then(user => utils.checkIfDataExists(user, 'Invalid Credentials', next))
			.then(user => Object.assign(req, {
				user
			}))
			.then(({
				user
			}) => cryptography.comparePassword(req.body.password, user.password))
			.then(result => utils.checkIfDataExists(result, 'Invalid Credentials', next))
			.then(result => Object.assign(req.user, {
				'authToken': jwt.sign(req.user, process.jwt.key)
			}))
			.then(result => utils.sendResponseIfTrue({
				'condition': result.authToken,
				'valueToSend': req.user,
				'responseObject': res,
				'errMessage': 'Invalid Credentials',
				'next': next
			}))
			.catch(err => next(err));

	}
};