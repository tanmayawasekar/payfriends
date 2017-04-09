/**
 * 
 */

const utils = require('../helpers/utils');

const cryptography = require('../helpers/crytography');

function getUserModel() {
	return process.dbObject.collection('users');
}

process.db.then((db, err) => {

	let collection = db.collection('users');

	db.command({
		'collMod': "users",
		'validator': {
			'$or': [{
				'emailId': {
					'$regex': /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				},
				'phoneNumber': {
					'$regex': /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
				}
			}]
		}
	});

	collection.createIndex({
		'phoneNumber': 1
	}, {
		unique: true,
		background: true
	});

	collection.createIndex({
		'emailId': 1
	}, {
		unique: true,
		background: true
	});
});

module.exports.requireFields = ['password', 'emailId', 'phoneNumber'];

module.exports.addOne = function (reqObject) {
	const promise = cryptography.encrypt(reqObject.password)
		.then(encryptedPassword => {
			reqObject.password = encryptedPassword;
			return reqObject;
		})
		.then(reqObject => getUserModel().insertOne(reqObject));

	return promise;
}

module.exports.checkIfUserExists =
	(reqObject, next) => {
		let query = reqObject.emailId ? {
				'emailId': reqObject.emailId
			} :
			reqObject.phoneNumber ? {
				'phoneNumber': reqObject.phoneNumber
			} : null;
		return getUserModel().findOne(query);
	};