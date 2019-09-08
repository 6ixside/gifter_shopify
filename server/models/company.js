var jwt = require('jsonwebtoken');
var jwtkey = process.env.JWT_KEY;

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
		},

		//get the company and decrypt the shopify access token and account
		getCompany: (shop) =>{
			var company_collection = mdb.db.collection('company');

			var i = "6sidecontracting@gmail.com"; //isuer
	  	var s = shop.split('.')[0]; //subject
			var a = shop; //audience

	  	//no expiry
	  	var opts = {
	  		issuer: i,
	  		subject: s,
	  		audience: a,
	  		algorithm: ["HS256"]
	  	}

			return new Promise((resolve, reject) =>{
				company_collection.findOne({
					url: shop
				}).then((doc) =>{
					try{
						var token_content = jwt.verify(doc.token, jwtkey, opts);
						var account = jwt.verify(doc.account, jwtkey, opts);
					} catch(err){
						reject("could not verify token or account");
					}

					doc.token = token_content.shop_token;
					doc.account = account;

					resolve(doc);
				})
			});
		}
	}
}