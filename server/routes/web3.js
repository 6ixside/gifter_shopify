var express = require('express');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);
const transaction = require('../models/transaction.js')();

module.exports = () =>{
	router.post('/newCompany', authentication.authenticate, (req, res, next)=>{
		if(typeof req.body.name !== 'string'){
			return res.status(422).json({
				error: "Please enter a valid company name"
			});
		}

		
	});

	return router;
}