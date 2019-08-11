var jwt = require('jsonwebtoken');
var jwtkey = process.env.JWT_KEY;

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
		install: (url, token) =>{
			console.log("installing")
			var company_collection = mdb.db.collection('company');

			var i = "6sidecontracting@gmail.com"; //isuer
		  	var s = url.split('.')[0]; //subject
			var a = url; //audience

			var payload = {
				shop_token: token
			}

		  	//no expiry
		  	var opts = {
		  		issuer: i,
		  		subject: s,
		  		audience: a,
		  		algorithm: "HS256"
		  	}

		  	var encrypt_token = jwt.sign(payload, jwtkey, opts);

			company_collection.insertOne({
				url: url,
				token: encrypt_token
			});
		},

		uninstall: () =>{

		}
	}
}