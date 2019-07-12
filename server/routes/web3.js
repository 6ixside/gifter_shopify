var express = require('express');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (w3c) =>{
	let transaction = require('../models/transaction.js')(w3c);

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

		authentication.authenticate(req, res, next).then(() =>{
			transaction.createNewCompany(req.body.name, req.body.password).then((res) =>{
				console.log("company created successfully");
				return res.status(200).json({
					res: res
				});
			}, (err) =>{
				console.log(err);
				return res.status(400).json(err);
			});
		}, (err) =>{
			console.log(err);
		});
	});

	return router;
}