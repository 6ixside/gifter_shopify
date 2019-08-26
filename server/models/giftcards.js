module.exports = (mdb) =>{
	return{
		//get all the gift cards from a specific shop
		getCards: (shop) =>{
			var card_collection = mdb.db.collection('giftcards');

			return new Promise((resolve, reject) =>{
				card_collection.find({
					shop: shop	
				}).then((cards) =>{
					console.log(cards);

					resolve(cards);
				}, (err) =>{
					reject(err);
				})
			});
		},

		getCardById: (id) =>{
			var card_collection = mdb.db.collection('giftcards');

			return new Promise((resolve, reject) =>{
				card_collection.findOne({
					shopifyId: id
				}).then((card) =>{
					if(card)
						resolve(card);
					else
						reject("No Card Found");
				}, (err) =>{
					console.log(err);
					reject(err);
				});
			});
		},

		//add a card to the shops cards
		addCard: (shop, id, val) =>{
			var card_collection = mdb.db.collection('giftcards');

			return new Promise((resolve, reject) =>{
				card_collection.insertOne({
					shop: shop,
					shopifyId: id,
					value: val
				}).then(() =>{
					resolve(); //card added successfully
				}, (err) =>{
					reject(err);
				});
			});
		}
	}
}