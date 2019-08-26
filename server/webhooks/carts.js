var express = require('express');
var cookie = require('cookie');
var request = require('request-promise');
var router = express.Router();

module.exports = (mdb) =>{
	let cart = require('../models/cart.js')(mdb);

	router.post('/create', (req, res) =>{
		console.log("cart created!");
		//console.log(req.body);

		var cartToken = req.body.token;
		cart.insertCart(cartToken).then((status) =>{
			if(status)
				res.status(200).send(); //ok

			res.status(400).send(); //can't insert for some reason
		}, (err) =>{
			console.log(err);
			res.status(500).send(); //error
		});
	});

	//update route is same for create route for now, probably will change stuff later?
	router.post('/update', (req, res) =>{
		console.log("cart updated!");
		//console.log(req.body);

		var cartToken = req.body.token;
		cart.insertCart(cartToken).then((status) =>{
			if(status)
				res.status(200).send(); //ok

			res.status(400).send(); //can't insert for some reason
		}, (err) =>{
			console.log(err);
			res.status(500).send(); //error
		});
	});

	return router;
}