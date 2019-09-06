var express = require('express');
var cookie = require('cookie');
var crypto = require('crypto');
var request = require('request-promise');
var helpers = require('../helpers')();
var router = express.Router();

module.exports = (mdb, w3c) =>{

	router.post('/create', (req, res) =>{
		console.log("checkout paid!");
		let company = require('../models/company.js')(mdb);
		let giftcards = require('../models/giftcards.js')(mdb);
		let transaction = require('../models/transaction.js')(mdb, w3c);

		console.log(req.get('X-Shopify-Hmac-Sha256'));
		console.log(req.body);

		let shop = req.get('X-Shopify-Shop-Domain');
		let lineItems = req.body.line_items;
		let customerEmail = req.body.email;

		company.getCompany(shop).then(async (comp) =>{
			for(item of lineItems){
				let id = item.product_id;

				console.log(id);

				await giftcards.getCardById(id).then((card) =>{
					if(card){
						console.log("gifter card purchased");

						let position = card.position;
						let secret = helpers.generateSecret();
						let generatedHash = crypto.createHash('sha256').update(secret + shop).digest('hex').substr(0, 32);
						
						//create card on blockchain
						transaction.purchaseCardEmail(comp.companyAddress, comp.address, position, generatedHash).then((hash) =>{
							console.log('hash: ' + hash);

							//email gift card
							helpers.sendGiftCard({
								email: customerEmail,
								code: secret
							});

							res.status(200).send();
						}, (err) =>{
							console.log(err);
							res.status(500).send();
						});
					}
				}, (err) =>{
					console.log(err);
					res.status(400).send();
				})
			}

			res.status(200).send();
		}, (err) =>{
			console.log(err);
			res.status(500).send();
		});
	});

	return router;
}