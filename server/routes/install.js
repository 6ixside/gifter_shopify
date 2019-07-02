var express = require('express');
var nonce = require('nonce');
var request = require('request-promise');
var router = express.Router();

var appUrl = "https://aaf3149d.ngrok.io";
var scopes = 'write_script_tags'

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
const authentication = require('../middlewares/authentication.js')(apiKey, apiSecret);

module.exports = (tokens) =>{

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

	    let headers = {
	      'X-Shopify-Access-Token': tokens[shop]
	    }

	    let body = {
	      "script_tag": {
	        "event": 'onload',
	        "src": appUrl + '/install/test'
	      }
	    }

	    request.post({
	      url: scriptTagUrl,
	      headers: headers,
	      body: body,
	      json: true
	    }).then((shopRes) => {
	      request.get({
	        url: 'https://' + shop + '/admin/script_tags.json',
	        headers: headers
	      }).then((data) => {/*console.log(data);*/})
	    }, (err) =>{
	      console.log('error: ' + err);
	    });
	  }

	  next();
	  //res.redirect(appUrl + '/gifter/auth');
	}, (req, res, next) =>{
	  //create new company in gifter


	  next();
	}, (req, res, next) =>{
	  var shop = req.query.shop;

	  authentication.authenticate(req, res, next).then((data) =>{
	    res.status(200).send('<p>Install Complete!</p>');
	    tokens[shop] = shop;
	  }, (err) =>{
	    console.log(err);
	  });
	  
	});

	router.get('/test', (req, res, next) =>{
	  res.sendfile(__dirname + '../../public/gifter.js');
	});

	return router;
}