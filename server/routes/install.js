var express = require('express');
var path = require('path');
var nonce = require('nonce');
var request = require('request-promise');
var router = express.Router();

var appUrl = process.env.NGROK;
var scopes = 'write_script_tags, write_products, read_checkouts, write_checkouts, read_orders, write_orders'

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (mdb, tokens) =>{
	let install = require('../models/install.js')(mdb);

	//main install route
	router.get('/', (req, res, next) =>{
		var shop = req.query.shop;
	  console.log('running install');

		if(shop){
			var state = nonce()(); //idk why nonce now needs to be called like this??
	    var redir = appUrl + '/install/setup';

	    var installUrl = 'https://' + shop +
	      '/admin/oauth/authorize?client_id=' + apiKey +
	      '&scope=' + scopes +
	      '&state=' + state +
	      '&redirect_uri=' + redir;
		
	  	res.cookie('state', state);
	 		res.redirect(installUrl);
		}
		else
			res.status(400).send('missing shop parameter');
	});

	//install route callback
	router.get('/setup', async (req, res, next) =>{

		var shop = req.query.shop;
		var scriptTagUrl = 'https://' + shop + '/admin/script_tags.json';
		console.log('running setup');

		if(tokens[shop] == undefined){
			await authentication.getAccessToken(req, res, next).then((token) =>{
				tokens[shop] = token;
			}, (err) =>{
				console.log(err);
			});

			console.log(tokens[shop]);

			let headers = {
				'X-Shopify-Access-Token': tokens[shop]
			}

			let body = {
			  "script_tag": {
			    "event": 'onload',
			    "src": appUrl + '/install/scripts'
			  }
			}

			//uncomment to reinstall script tag
			/*request.post({
			  url: scriptTagUrl,
			  headers: headers,
			  body: body,
			  json: true
			}).then((shopRes) => {
				console.log("script tag installed");

			  //request.get({
			  //  url: 'https://' + shop + '/admin/script_tags.json',
			  //  headers: headers
			  //}).then((data) => {console.log(data);})
			}, (err) =>{
			  console.log('error: ' + err);
			});*/

			//uncomment to delete all tags
			/*request.get({
		    url: 'https://' + shop + '/admin/script_tags.json',
		    headers: headers
			}).then(async (tags) =>{
				console.log(tags);

				
				for(t of JSON.parse(tags)["script_tags"]){
					var url = 'https://' + shop + '/admin/api/2019-07/script_tags/' + t.id + '.json';

					await request.delete({
						url: url,
						headers: headers
					}).then(() => {console.log("deleted");}, (err) =>{
						console.log("could not delete: " + url);
					});
				}
			});*/

		}

	  next();
	  //res.redirect(appUrl + '/gifter/auth');
	}, async (req, res, next) =>{
		//install all webhooks
		var shop = req.query.shop;
		console.log(shop);
		var webhookUrl = 'https://' + shop + '/admin/api/2019-07/webhooks.json';

		let headers = {
			'X-Shopify-Access-Token': tokens[shop]
		}

		let topics = ['orders/create', 
									'carts/create',
									'carts/update', 
									'checkouts/create',
									'checkouts/update'];

		//uncomment to reinstall webhooks
		/*for(t of topics){
			var body = {
				'webhook': {
					"topic": t,
					"address": appUrl + '/webhooks/' + t,
					"format": 'json'
				}
			}

			await request.post({
				url: webhookUrl,
				headers: headers,
				body: body,
				json: true
			}).then((shopRes) =>{
				console.log(shopRes);
			}, (err) =>{
				console.log("could not create webhook :(");
				console.log(err);
			});
		}*/

		//uncomment to delete all webhooks
		/*request.get({
			url: 'https://' + shop + '/admin/api/2019-07/webhooks.json',
			headers: headers
		}).then(async (hooks) =>{
			console.log(hooks);

			for(h of JSON.parse(hooks)['webhooks']){
				var url = 'https://' + shop + '/admin/api/2019-07/webhooks/' + h.id + '.json';

				await request.delete({
					url: url,
					headers: headers
				}).then(() => {console.log("deleted");}, (err) =>{
					console.log("could not delete: " + url);
				});
			}
		});*/

		next();
	}, (req, res, next) =>{
	  var shop = req.query.shop;

	  authentication.authenticate(req, res, next).then((data) =>{
	  	install.install(shop, tokens[shop]); //create shop in db
	    res.status(200).send('<p>Install Complete!</p>');
	  }, (err) =>{
	    console.log(err);
	  });
	  
	});

	router.get('/scripts', (req, res, next) =>{
		res.sendFile(path.resolve(__dirname + './../../public/gifter_redeem.js'));
	});

	return router;
}