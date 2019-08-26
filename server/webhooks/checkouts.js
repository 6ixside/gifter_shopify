var express = require('express');
var cookie = require('cookie');
var request = require('request-promise');
var router = express.Router();

module.exports = (mdb) =>{
	let cart = require('../models/cart.js')(mdb);

	router.post('/create', (req, res) =>{
		console.log("checkout created!");
		//console.log(req.body);

		var cartToken = req.body.cart_token;
		var checkoutToken = req.body.token;

		cart.linkCheckout(cartToken, checkoutToken).then(() =>{
			res.status(200).send(); //ok
		}, (err) =>{
			console.log(err);
			res.status(500).send(); //error
		});
	});

	router.post('/update', (req, res) =>{
		console.log("checkout updated!");
		//console.log(req.body);
		
		var cartToken = req.body.cart_token;
		var checkoutToken = req.body.token;

		cart.linkCheckout(cartToken, checkoutToken).then(() =>{
			res.status(200).send(); //ok
		}, (err) =>{
			console.log(err);
			res.status(500).send(); //error
		});
	});

	return router;
}