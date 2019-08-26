var express = require('express');
var cookie = require('cookie');
var request = require('request-promise');
var helpers = require('../helpers');
var router = express.Router();

module.exports = (mdb) =>{

	router.post('/create', async (req, res) =>{
		console.log("checkout paid!");
		let giftcards = require('../models/giftcards.js');
		let transaction = require('../models/transaction.js');

		console.log(req.get('X-Shopify-Hmac-Sha256'));
		console.log(req.body);

		let lineItems = req.body.line_items;
		let customerEmail = req.body.email;

		for(item of lineItems){
			let id = item.id;

			await giftcards.getCardById(id).then((card) =>{
				if(card){
					console.log("gifter card purchased");

					//create card on blockchain

					//email giftcard to user

				}
			}, (err) =>{
				console.log(err);
				res.status(400).send();
			})
		}

		res.status(200).send();
	});

	return router;
}