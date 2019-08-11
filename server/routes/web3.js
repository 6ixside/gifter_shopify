var express = require('express');
var cookie = require('cookie');
var request = require('request-promise');
var helpers = require('../helpers');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (mdb, w3c) =>{
	let company = require('../models/company.js')(mdb);
	let transaction = require('../models/transaction.js')(mdb, w3c);

	router.post('/newCompany', (req, res, next)=>{
		if(typeof req.body.name !== 'string'){
			return res.status(422).json({
				error: "Please enter a valid company name"
			});
		}

		if(typeof req.body.password !== 'string'){
			return res.status(422).json({
				error: "Password must be a string"
			});
		}

		var shop = cookie.parse(req.headers.cookie).shopOrigin;
		console.log(shop);

		authentication.verifyToken(req, res, next).then(() =>{
			console.log("creating company");

			transaction.createNewCompany(shop, req.body.name, req.body.password).then((hash) =>{
				console.log("company created successfully");
				console.log(hash);
				return res.status(200).send();
			}, (err) =>{
				console.log(err);
				return res.status(500).send(err);
			});
		}, (err) =>{
			console.log(err);
		});
	});

	//works very basic, need to upgrade the REST call here a lot 
	//create a new card
	router.post('/newCard', (req, res, next) =>{
		if(typeof req.body.title !== 'string'){
			return res.status(422).json({
				error: "Please enter a valid card title"
			});
		}

		if(typeof req.body.desc !== 'string'){
			return res.status(422).json({
				error: "Please enter a valid card description"
			});
		}

		if(typeof req.body.value !== 'string'){
			return res.status(422).json({
				error: "The value of the card must be a number"
			});
		}

		let card = {
			title: req.body.title,
			desc: req.body.desc,
			value: parseFloat(req.body.value)
		}

		authentication.verifyToken(req, res, next).then(() =>{
			var shop = cookie.parse(req.headers.cookie).shopOrigin;
			var url = 'https://' + shop + '/admin/api/2019-07/products.json'

			company.getCompany(shop).then((comp) =>{
				var headers = {
					'X-Shopify-Access-Token': comp.token
				}

				var body = {
					"product": {
						"title": card.title,
						"body_html": "<strong>" + card.desc + "!</strong>",
						"vendor": "6Side",
						"variants": [{
							"position": 1,
							"price": card.value
						}]
					}
				}

				request.post({
					url: url,
					headers: headers,
					body: body,
					json: true
				}).then((shopRes) =>{
					console.log(shopRes);

					//decrypt the bc account
					account = w3c.decryptAccount(comp.account, 'mytestpass');

					if(account.address != comp.address){
						console.log("company account mismatch!!");
						throw new Error("company/account mismatch")
					}

					//use the account to create a wallet
					transaction.createNewCard(account, comp.address, card).then((hash) =>{
						console.log("transaction hash: " + hash);
					}, (err) =>{
						console.log(err);
					});

					res.status(200).send();
				}, (err) =>{
					console.log(err);
				})
			}, (err) =>{
				console.log(err);
			});
		});
	});

	//would this be a webhook?
	router.post('/purchaseEmail', (req, res, next) =>{
		let secret = helpers.generateSecret();


	});

	return router;
}