var express = require('express');
var router = express.Router();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (mdb, tokens, app) =>{
	let install = require('../models/install.js')(mdb);

	/*admin panel page*/
	router.get('/', (req, res, next) =>{
		var shop = req.query.shop;
		const query = Object.keys(req.query).map((key) => `${key}=${req.query[key]}`).join('&');

		install.isInstalled(shop).then((isInstalled) =>{
			//if no shop in db then install app, while doing dev, just always reinstall 
			if(!isInstalled || true){
				res.redirect(`/install/?${query}`);
			}
			else{
				console.log('doing authentication');
				authentication.authenticate(req, res, next).then((data) =>{
			    //res.status(200).send('<p>Admin Panel</p>');
			    
			    res.cookie('shopOrigin', shop, { httpOnly: false })
			    app.render(req, res, '/', req.query);
			  }, (err) =>{
			    console.log(err);
			  });
			}
		}, (err) =>{
			res.status(500).send();
		});
	});

	return router;
}