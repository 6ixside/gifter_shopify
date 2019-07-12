var express = require('express');
var cookie = require('cookie');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (mdb) =>{
	let company = require('../models/company.js')(mdb);

	router.get('/exists', (req, res, next) =>{
		authentication.verifyToken(req, res, next).then(() =>{
			var shop = cookie.parse(req.headers.cookie).shopOrigin;

			//get shop existance status
			company.exists(shop).then((exists) =>{
				res.status(200).send({exists: exists});
			}, (err) =>{
				res.status(501).send();
			});
		}, (err) =>{
			console.log(err);
			res.status(501).send();
		});
	});

	router.post('/newCompany', (req, res, next) =>{
		authentication.verifyToken(req, res, next).then(() =>{

		}, (err) =>{
			console.log(err);
			res.status(501).send();
		});
	});

	return router;
}