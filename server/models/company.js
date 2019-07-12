module.exports = (mdb) =>{
	return{
		exists: (url) =>{
			var company_collection = mdb.db.collection('company');

			return new Promise((resolve, reject) =>{
				company_collection.findOne({
					url: url,
					address: { $exists: false }
				}).then((doc) =>{
					if(doc)
						resolve(false); //found a record with no address, company doesn't exist

					resolve(true); //company exists
				}, (err) =>{
					reject(err);
				});
			});
		}
	}
}