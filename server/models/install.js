module.exports = (mdb) =>{
	return{
		isInstalled: (url) =>{
			var company_collection = mdb.db.collection('company');

			return new Promise((resolve, reject) =>{
				company_collection.findOne({
					url: url
				}).then((doc) =>{
					if(!doc)
						resolve(false); // is not installed

					resolve(true); //is installed
				}, (err) =>{
					reject(err);
				})
			});
		},

		//TODO: implement as promie
		install: (url) =>{
			var company_collection = mdb.db.collection('company');

			company_collection.insertOne({
				url: url
			});
		},

		uninstall: () =>{

		}
	}
}