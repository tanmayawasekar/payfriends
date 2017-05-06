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
					throw err;
				} else {
					utils.sendResponseIfTrue({
						'condition': user,
						'valueToSend': user.ops[0] || user,
						'responseObject': res,
						'errMessage': 'Internal Server Error',
						'cb': () => {
							res.setHeader('X-Authorization', jwt.sign({
								'emaildId': user.ops[0].emailId
							}, process.jwt.key, {
								'expiresIn': process.jwt.expirationTime
							}));
						}
					});
				}
			})
			.catch(err => {
				return next(err);
			});
	},
	registerUserSocial(req, res, next) {
		if (req.body.social) {
			utils.checkIfRequiredFieldsExists({
					'objectToCheckIn': req.body,
					'requiredFields': userOperations.requireFields,
					'errMessage': 'Bad Request',
					'ignoreFields': 'password',
				})
				.then(result => userOperations.checkIfUserExists(req.body))
				.then(user => {
					let fn = user ? {
						'a': () => process.dbObject.collection('users')
							.findOneAndUpdate({
								'_id': user._id
							}, {
								'$push': {
									'social': req.body.social,
								}
							}),
						'b': () => {
							throw new Error(`You Have Already Registered with ${req.body.social}`);
						}
					}[
						(() => {
							user.social = user.social || [];
							return user.social.indexOf(req.body.social) === -1 ? 'a' : 'b';
						})()
					] : () => {
						return userOperations.addOne(Object.assign(
							req.body, {
								'social': [req.body.social]
							}
						));
					};
					return fn();
				})
				.then((user, err) => {
					if (err) {
						throw err;
					} else {
						utils.sendResponseIfTrue({
							'condition': user,
							'cb': function () {
								res.setHeader('X-Authorization', jwt.sign({
									'emaildId': user.emailId
								}, process.jwt.key, {
									'expiresIn': process.jwt.expirationTime
								}));
							},
							'valueToSend': user.ops || user.value,
							'responseObject': res,
							'errMessage': user ? 'Internal Server Error' : err ? err.message : 'Internal Server Error'
						});
					}
				})
				.catch(err => next(err));
		} else {
			next();
		}
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
			.then(result => {
				res.setHeader('X-Authorization', jwt.sign({
					'emaildId': req.user.emailId
				}, process.jwt.key, {
					'expiresIn': process.jwt.expirationTime
				}));
			})
			.then(result => utils.sendResponseIfTrue({
				'condition': true,
				'valueToSend': req.user,
				'responseObject': res,
				'errMessage': 'Invalid Credentials'
			}))
			.catch(err => next(err));

	},

	logoutUser(req, res, next) {
		res.send(true);
	}
};