var express = require('express');
var cookie = require('cookie');
var request = require('request-promise');
var router = express.Router();

module.exports = () =>{
	router.post('/create', (req, res) =>{
		console.log("checkout paid!");
		console.log(req.get('X-Shopify-Hmac-Sha256'));
		console.log(req.body);

		res.status(200).send();
	});

	return router;
}