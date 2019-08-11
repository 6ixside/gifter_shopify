var request = require('request-promise');
var crypto = require('crypto');
var cookie = require('cookie');
var querystring = require('querystring');
var jwt = require('jsonwebtoken');

var jwtkey = process.env.JWT_KEY;

module.exports = (key, secret) =>{
	return{
		getAccessToken: function(req, res, next){
			return new Promise((resolve, reject) =>{
				const { shop, hmac, code, state } = req.query;
			  const stateCookie = cookie.parse(req.headers.cookie).state;

			  if (state !== stateCookie) {
			    reject({403: 'Request origin cannot be verified'});
			  }

			  if(shop && hmac && code){
			  	const map = Object.assign({}, req.query);
			    delete map['signature'];
			    delete map['hmac'];

			    const message = querystring.stringify(map);
			    const providedHmac = Buffer.from(hmac, 'utf-8');
			    const generatedHash = Buffer.from(crypto.createHmac('sha256', secret).update(message).digest('hex'), 'utf-8');
			    let hashEquals = false;

			    try {
			      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
			    } catch (e) {
			      hashEquals = false;
			    };

			    if (!hashEquals) {
			      reject({400: 'HMAC validation failed'});
			    }

			    var accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
			    var accessTokenPayload = {
			      client_id: key,
			      client_secret: secret,
			      code,
			    };

			    request.post(accessTokenRequestUrl, { 
			    	json: accessTokenPayload
			    }).then((accessTokenResponse) => {
			      var accessToken = accessTokenResponse.access_token;

			      resolve(accessToken);
			    }, (err) =>{
			    	reject(err.error.error_description);
			    }).catch((err) => {
			      reject(err.error.error_description);
			    });
			  }
			  else
			  	reject({400: 'Required parameters missing'});
			});
		},

		authenticate: function(req, res, next){
			return new Promise((resolve, reject) =>{
				const { shop, hmac, code, state } = req.query;

			  if(shop && hmac){
			  	const map = Object.assign({}, req.query);
			    delete map['signature'];
			    delete map['hmac'];

			    const message = querystring.stringify(map);
			    const providedHmac = Buffer.from(hmac, 'utf-8');
			    const generatedHash = Buffer.from(crypto.createHmac('sha256', secret).update(message).digest('hex'), 'utf-8');
			    let hashEquals = false;

			    try {
			      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
			    } catch (e) {
			      hashEquals = false;
			    };

			    if (!hashEquals) {
			      reject({400: 'HMAC validation failed'});
			    }

				  var token_payload = {
				  	shop: shop
				  };

				  var i = "6sidecontracting@gmail.com"; //isuer
				  var s = shop.split('.')[0]; //subject
				  var a = shop; //audience

				  var sOpts = {
				  	issuer: i,
				  	subject: s,
				  	audience: a,
				  	expiresIn: "12h",
				  	algorithm: "HS256"
				  }

				  var token = jwt.sign(token_payload, jwtkey, sOpts);
				  res.cookie('gifter_access_token', token); //set the jwt

				  resolve();
			  }
			  else
			  	reject({400: 'unknown error'});
			});
		},

		verifyToken: function(req, res, next){
			return new Promise((resolve, reject) =>{
				if(!req.headers.cookie)
					reject("can't access cookie");

				const shop = cookie.parse(req.headers.cookie).shopOrigin;
				const tokenCookie = cookie.parse(req.headers.cookie).gifter_access_token;

				var i = "6sidecontracting@gmail.com"; //isuer
			  var s = shop.split('.')[0]; //subject
			  var a = shop; //audience

				var vOpts = {
					issuer: i,
			  	subject: s,
			  	audience: a,
			  	expiresIn: "12h",
			  	algorithm: ["HS256"]
				}

				try{
					var token_content = jwt.verify(tokenCookie, jwtkey, vOpts);
				} catch(err){
					reject("could not verify token");
				}

				if(shop != token_content.shop)
					reject("shop doesn't match");

				resolve();
			});
		}
	}
}