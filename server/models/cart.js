module.exports = (mdb) =>{
	return{
		//add cart to db if it doesn't exist
		insertCart: (token) =>{
			var cart_collection = mdb.db.collection('carts');

			return new Promise((resolve, reject) =>{
				cart_collection.findOne({
					cartToken: token
				}).then((doc) =>{
					if(doc)
						resolve(true); //cart already exists
					
					else if(cart_collection.insertOne({cartToken: token}))
						resolve(true); //cart insert successfully

					resolve(false); //cart can't be created
				}, (err) =>{
					reject(err);
				});
			});
		},

		//associate checkout token with cart token
		linkCheckout: (cartToken, checkoutToken) =>{
			var cart_collection = mdb.db.collection('carts');

			return new Promise((resolve, reject) =>{
				cart_collection.updateOne({
					cartToken: cartToken
				}, {
					$set: {
						checkoutToken: checkoutToken
					}
				}).then((doc) =>{
					console.log('associated cart successfully');
					resolve();
				}, (err) =>{
					reject(err);
				})
			});
		},

		//apply gift cards to current cart
		applyGiftCard: (cartToken, code) =>{
			var card_collection = mdb.db.collection('appliedcards');

			return new Promise((resolve, reject) =>{
				card_collection.insertOne({
					cartToken: cartToken,
					code: code,
					val: 25
				}).then(() =>{
					resolve();
				}, (err) =>{
					console.log(err);
					reject(err);
				})
			});
		}
	}
}