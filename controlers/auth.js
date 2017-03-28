
module.exports = {
	registerUser(req, res) {
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
	}
} 