var express = require('express');
var cookie = require('cookie');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (mdb, w3c) =>{
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

	return router;
}