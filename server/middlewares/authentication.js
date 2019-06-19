var request = require('request-promise');
var crypto = require('crypto');
var cookie = require('cookie');
var querystring = require('querystring');

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
			  const stateCookie = cookie.parse(req.headers.cookie).state;

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

			    resolve();
			  }
			  else
			  	reject({400: 'unknown error'});
			});
		}
	}
}