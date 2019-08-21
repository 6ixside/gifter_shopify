var express = require('express');
var cookie = require('cookie');
var request = require('request-promise');
var router = express.Router();

module.exports = () =>{
	router.post('/create', (req, res) =>{
		console.log("checkout created!");
		//console.log(req.body);
		
		res.status(200).send();
	});

	router.post('/update', (req, res) =>{
		console.log("checkout updated!");
		//console.log(req.body);
		
		res.status(200).send();
	});

	return router;
}