var express = require('express');
var cookie = require('cookie');
var request = require('request-promise');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (mdb, w3c, tokens) =>{
	let cart = require('../models/cart.js')(mdb);
	let company = require('../models/company.js')(mdb);
	let giftCards = require('../models/giftcards.js')(mdb);
	let transaction = require('../models/transaction.js')(mdb, w3c);

	router.post('/create', (req, res) =>{
		console.log("checkout created!");
		//console.log(req.body);

		let shop = req.get('X-Shopify-Shop-Domain');
		let cartToken = req.body.cart_token;
		let checkoutToken = req.body.token;

		cart.linkCheckout(cartToken, checkoutToken).then(() =>{
			//maybe something here later
		}, (err) =>{
			console.log(err);
			res.status(500).send(); //error
		});

		company.getCompany(shop).then((comp) =>{
			giftCards.getAppliedCards(cartToken).then(async (cards) =>{
				let discount = 0;

				for(card of cards){
					await transaction.getCardInfo(card.secret).then((card) =>{
						discount += card['1'].toNumber(); //card['1'] is balance

						console.log(discount);
					});
				}

				let url = 'https://' + shop + '/admin/api/2019-10/checkouts/' + checkoutToken +'.json';

				let headers = {
					'Content-Type': 'application/json',
					'X-Shopify-Access-Token': comp.token
				}

				let body = {
					checkout: {
						token: checkoutToken,
						applied_discount: {
							title: "gifter applied discount",
							amount: String(discount),
							value: String(discount),
							value_type: "fixed_amount",
							applicable: true
						}
					}
				}

				if(discount > 0){
					request.put({
						url: url,
						headers: headers,
						body: body,
						json: true
					}).then((shopRes) =>{
						console.log("discount applied!");
						res.status(200).send(); //ok
					});
				}

				console.log(cards);

				res.status(200).send(); //ok
			}, (err) =>{
				console.log(err);
				res.status(500).send();
			});
		}, (err) =>{
			console.log(err);
			res.status(500).send();
		});
	});

	router.post('/update', (req, res) =>{
				console.log("checkout created!");
		//console.log(req.body);

		let shop = req.get('X-Shopify-Shop-Domain');
		let cartToken = req.body.cart_token;
		let checkoutToken = req.body.token;

		cart.linkCheckout(cartToken, checkoutToken).then(() =>{
			//maybe something here later
		}, (err) =>{
			console.log(err);
			res.status(500).send(); //error
		});

		company.getCompany(shop).then((comp) =>{
			giftCards.getAppliedCards(cartToken).then(async (cards) =>{
				let discount = 0;

				for(card of cards){
					await transaction.getCardInfo(card.secret).then((card) =>{
						discount += card['1'].toNumber(); //card['1'] is balance

						console.log(discount);
					});
				}

				let url = 'https://' + shop + '/admin/api/2019-10/checkouts/' + checkoutToken +'.json';

				let headers = {
					'Content-Type': 'application/json',
					'X-Shopify-Access-Token': comp.token
				}

				let body = {
					checkout: {
						token: checkoutToken,
						applied_discount: {
							title: "gifter applied discount",
							amount: String(discount),
							value: String(discount),
							value_type: "fixed_amount",
							applicable: true
						}
					}
				}

				if(discount > 0){
					request.put({
						url: url,
						headers: headers,
						body: body,
						json: true
					}).then((shopRes) =>{
						console.log("discount applied!");
						res.status(200).send(); //ok
					});
				}

				console.log(cards);

				res.status(200).send(); //ok
			}, (err) =>{
				console.log(err);
				res.status(500).send();
			});
		}, (err) =>{
			console.log(err);
			res.status(500).send();
		});

	});

	//for removing the gift card from applied cards table and also
	//deducting the balance on the blockchain
	/*request.post('/paid', (req, res) =>{
		console.log("checkout paid!");
		console.log(req);

		let shop = req.get('X-Shopify-Shop-Domain');
		let cartToken = req.body.cart_token;
		let checkoutToken = req.body.token;
		let isGifterPurchase = false;
		let total = parseFloat(req.body.total_price);
		let deduction = 0;

		for(discount of req.body.discount_codes){
			if(discount.code == 'gifter applied discount'){
				isGifterPurchase = true;

				deduction += parseFloat(discount.value);
			}
		}

		if(deduction > total)
			deduction = total;

		if(isGifterPurchase){
			//after pay, remove gift card from applied cards
			cart.removeGiftCard(cartToken).then((secret) =>{
				console.log("gift card removed");

				transaction.deductBalance(secret, deduction).then(() =>{
					console.log("giftcard updated successfully");
				}, (err) =>{
					console.log(err);
					res.status(500).send();
				})
			}, (err) =>{
				console.log(err);
				res.status(500).send();
			});
		}
		else
			res.status(200).send();
	});*/

	return router;
}