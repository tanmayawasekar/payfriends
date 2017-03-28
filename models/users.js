process.db.then((db, err) => {

	db.command({
		'collMod': "users",
			'validator': {
				'$or': [{
					'emailId': {
						'$regex': /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					}
				}]
			}
	});


	let collection = db.collection('users');
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
	})
});