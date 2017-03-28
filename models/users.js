process.db.then((db, err) => {
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