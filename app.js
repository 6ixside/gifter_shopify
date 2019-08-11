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

//routes
const index = require('./server/routes/index')(mdb, tokens, app);
const install = require('./server/routes/install')(mdb, tokens);
const web3 = require('./server/routes/web3')(mdb, w3c);
const store = require('./server/routes/store')(mdb);

//webhooks
const orders = require('./server/webhooks/orders')();


app.prepare().then(() => {
  var server = express();

  server.use(express.json());
  server.use((req, res, next) =>{  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });  

  //routes
  server.use('/', index);
  server.use('/install', install);
  server.use('/w3', web3);
  server.use('/store', store);

  //webhooks
  server.use('/webhooks/orders', orders);

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
  