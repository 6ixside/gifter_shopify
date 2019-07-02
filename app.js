var request = require('request-promise');
var express = require('express');
var next = require('next');
var cookie = require('cookie');
var dontenv = require('dotenv').config()
var Web3Connector = require('./server/Web3Connector');
var MongoConnector = require('./server/MongoConnector');
var w3c = new Web3Connector();
var mdb = new MongoConnector();

var dev = process.env.NODE_ENV !== 'production';
var app = next({ dev,
  dir: './src'
});
var handle = app.getRequestHandler();

var tokens = {}
const index = require('./server/routes/index')(tokens, app);
const install = require('./server/routes/install')(tokens);
const web3 = require('./server/routes/web3')(w3c);


app.prepare().then(() => {
  var server = express();

  server.use('/', index);
  server.use('/install', install);
  server.use('/w3', web3);

  server.get('*', (req, res, next) =>{
    return handle(req, res);
  });

  //handle 404
  /*server.use((req, res, next) =>{
    var err = new Error('Page not found :(');
    err.status = 404;
    next(err);
  });*/

  server.listen(4567, () =>{console.log('running gifter')});
});
  