var request = require('request-promise');
var express = require('express');
var cookie = require('cookie');
var nonce = require('nonce');
var dontenv = require('dotenv').config()

var app = express();

var tokens = {}
const index = require('./server/routes/index')(tokens);
const install = require('./server/routes/install')(tokens);


/*app.get('/gifter/auth', async (req, res, next) =>{
  var shop = req.query.shop;

  if(tokens[shop] == undefined){
    await authentication.getAccessToken(req, res, next).then((token) =>{
      tokens[shop] = token;
      console.log(tokens);

      res.status(200).send('this is where the admin panel will go!');
    }, (err) =>{
      console.log(err);
    });
  }
});*/

app.use('/', index);
app.use('/install', install);

//handle 404
app.use((req, res, next) =>{
  var err = new Error('Page not found :(');
  err.status = 404;
  next(err);
});

app.listen(4567, () =>{console.log('running gifter')});