var express = require('express');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (mdb) =>{
	let company = require('../models/company.js')(mdb);

	router.get('/exists', (req, res, next) =>{
		console.log(req.query);

		res.status(200).send();
	});

	return router;
}