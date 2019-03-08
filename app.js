var request = require('request-promise');
var express = require('express');
var cookie = require('cookie');
var nonce = require('nonce');
var dontenv = require('dotenv').config()

var app = express();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
var appUrl = "https://76bbfe42.ngrok.io";

let authentication = require('./server/middlewares/authentication.js')(apiKey, apiSecret);

var scopes = 'write_script_tags'
tokens = {};

app.get('/', (req, res, next) =>{
  res.send('test2');
})

app.get('/gifter/install', (req, res, next) => {
	var shop = req.query.shop;
	
	if(shop){
		var state = nonce()(); //idk why nonce now needs to be called like this??
    var redir = appUrl + '/gifter/setup';

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

app.get('/gifter/setup', async (req, res, next) =>{
  var shop = req.query.shop;
  var scriptTagUrl = 'https://' + shop + '/admin/script_tags.json';

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
        "src": appUrl + '/test'
      }
    }

    request.post({
      url: scriptTagUrl,
      headers: headers,
      body: body,
      json: true
    }).then((shopRes) => {
      console.log(shopRes);

      request.get({
        url: 'https://' + shop + '/admin/script_tags.json',
        headers: headers
      }).then((data) => {console.log(data);})
    }, (err) =>{
      console.log('error: ' + err);
    });
  }

  next();
  //res.redirect(appUrl + '/gifter/auth');
}, (req, res, next) =>{
  var shop = req.query.shop;

  res.status(200).send('<p>Admin Panel</p>');
});

app.get('/gifter/auth', (req, res, next) =>{
  var shop = req.query.shop;

  authentication.getAccessToken(req, res, next).then((token) =>{
    tokens[shop] = token;

    console.log(tokens)

    res.status(200).send('this is where the admin panel will go!');
  }, (err) =>{
    console.log(err);
  });
});

app.get('/test', (req, res, next) =>{
  res.sendfile(__dirname + '/public/gifter.js');
})

app.listen(4567, () =>{console.log('running gifter')});