var EthereumTx = require('ethereumjs-tx').Transaction;
var ethereumUtil = require('ethereumjs-util');
var fs = require('fs');
var path = require('path')

var jwt = require('jsonwebtoken');
var jwtkey = process.env.JWT_KEY;
var pk = new Buffer.from(process.env.PRIVATE_KEY, "hex");

var contracts = {
	"CompanyFactory": {
		"abi": JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../contracts/CompanyFactory.abi"))),
		"address": "0xa0ce319e9674778c78378369a311ec0a38008c5a"
	}
} 

module.exports = (mdb, w3c) =>{
	return{
		createNewCompany: (url, name, password) =>{
			var cf = new w3c.web3.eth.Contract(contracts["CompanyFactory"]["abi"], contracts["CompanyFactory"]["address"]);
			var company_collection = mdb.db.collection('company');

			return new Promise((resolve, reject) =>{
				if(name.length > 32)
					reject({error: "Company name must be less than 32 characters"});

				//create a new account on the blockchain to own the company
				w3c.createAccount(password).then((data) =>{
					var account = data.account;
					var encrypt = data.encrypt;

					var i = "6Side Co"; //isuer
				  var s = url.split('.')[0]; //subject
				  var a = url; //audience

				  //no expiry
				  var opts = {
				  	issuer: i,
				  	subject: s,
				  	audience: a,
				  	algorithm: "HS256"
				  }

				  //storing in db as a jwt for ease, todo for future will be to make this better
				  var encrypt_token = jwt.sign(encrypt, jwtkey, opts);

					company_collection.updateOne(
						{url: url},
						{$set: {
							address: account.address,
							account: encrypt_token
						}
					});

					var method = cf.methods.createNewCompany(w3c.web3.utils.asciiToHex(name), account.address);
					var trx_encode = method.encodeABI();

					w3c.web3.eth.getTransactionCount(w3c.gifterAccount.address).then(c =>{
						console.log("transaction count: " + c);

						var trx = new EthereumTx({
			    		nonce: w3c.web3.utils.toHex(c), //nonce is 0 after account creation, for testing increment nonce even higher
			    		from: w3c.gifterAccount.address,
			    		to: contracts["CompanyFactory"]["address"],
			    		gas: w3c.web3.utils.toHex(5000000),
	    				gasPrice: w3c.web3.utils.toHex(1000000000),
			    		data: trx_encode
			    	}, {chain: 'rinkeby'});
						trx.sign(pk);

						var serializedTrx = '0x' + trx.serialize().toString('hex');

						console.log("sending from");
						console.log(w3c.gifterAccount.address);

						w3c.web3.eth.sendSignedTransaction(serializedTrx).on('transactionHash', function(hash){
					    console.log('hash: ' + hash);
						}).on('receipt', function(receipt){
					    console.log('receipt: ' + receipt);
					    resolve(receipt);
						}).on('confirmation', function(confirmationNumber){
							console.log('confirmation number: ' + confirmationNumber);
						}).on('error', function(e){
							reject(e);
						});
					});

				}, (err) =>{
					reject(err);
				});
			});
		}
	}
}