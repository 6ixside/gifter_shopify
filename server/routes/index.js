var express = require('express');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (tokens) =>{
	/*admin panel page*/
	router.get('/', (req, res, next) =>{
		var shop = req.query.shop;
		const query = Object.keys(req.query).map((key) => `${key}=${req.query[key]}`).join('&');

		//if no shop in db then install app, while doing dev, just always reinstall 
		if(!tokens[shop]){
			res.redirect(`/install/?${query}`);
		}
		else{
			console.log('doing authentication');

			authentication.authenticate(req, res, next).then((data) =>{
		    res.status(200).send('<p>Admin Panel</p>');
		  }, (err) =>{
		    console.log(err);
		  });
		}
	});

	return router;
}