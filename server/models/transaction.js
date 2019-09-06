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
		"address": "0x8B81215944e7C9677636176cC92C004cCBc584ff"//"0x7f84deeb6aa435181ebcd7b6e64d9e1c20fce5e3"
	},

	"Company": {
		"abi": JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../contracts/Company.abi")))
	},

	"CardUtil": {
		"abi": JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../contracts/CardUtil.abi"))),
		"address": "0x86C1586f0c0b3E0F3fA3A64b558219Cc4Ad5eFbe"
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

					var i = "6sidecontracting@gmail.com"; //isuer
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
					var method = cf.methods.createNewCompany(w3c.web3.utils.asciiToHex(name), account.address);
					var trx_encode = method.encodeABI();

					//create an event listener to listen to company creation events
					var companyListener = cf.events.newCompany().on("data", (t) =>{
						let address = t.returnValues.owner;
						let company = t.returnValues.contractAddress;

						console.log("company created");
						company_collection.updateOne(
							{url: url},
							{$set: {
								address: address,
								companyAddress: company,
								account: encrypt_token
							}
						});
					}).on("error", (e) =>{
						console.log("error creating company");
					});

					w3c.web3.eth.getTransactionCount(w3c.gifterAccount.address).then(c =>{
						console.log("transaction count: " + c);

						var trx = new EthereumTx({
				    		nonce: w3c.web3.utils.toHex(c), //nonce is 0 after account creation, for testing increment nonce even higher
				    		from: w3c.gifterAccount.address,
				    		to: contracts["CompanyFactory"]["address"],
				    		gas: w3c.web3.utils.toHex(5000000),
		    				gasPrice: w3c.web3.utils.toHex(170000000),
				    		data: trx_encode
				    	}, {chain: 'rinkeby'});
						trx.sign(pk);

						var serializedTrx = '0x' + trx.serialize().toString('hex');

						console.log("sending from");
						console.log(w3c.gifterAccount.address);

						w3c.web3.eth.sendSignedTransaction(serializedTrx).on('transactionHash', function(hash){
					    console.log('hash: ' + hash);
					    resolve(hash);
						}).on('receipt', function(receipt){
					    //console.log('receipt: ' + receipt);
					    //resolve(receipt);
						}).on('confirmation', function(confirmationNumber){
							//console.log('confirmation number: ' + confirmationNumber);
						}).on('error', function(e){
							reject(e);
						});
					});

				}, (err) =>{
					reject(err);
				});
			});
		},

		createNewCard: (account, company_address, card) =>{
			return new Promise((resolve, reject) =>{
				var card_collection = mdb.db.collection('giftcards');
				var company = new w3c.web3.eth.Contract(contracts["Company"]["abi"], company_address);
				var method = company.methods.createNewCard(card.value, 1); //TODO, implement tradibility
				var trx_encode = method.encodeABI();

				var cardListener = company.events.newCard().on("data", (t) =>{
					let position = t.returnValues.position;

					console.log("card created");
					console.log(position);

					card_collection.updateOne(
						{shopifyId: card.id},
						{$set: {
							position: (position.toNumber() - 1) //-1 because indexing changes for some reason
						}
					});
				});

				w3c.web3.eth.getTransactionCount(account.address).then(c =>{
					console.log("transaction count: " + c);

					var trx = new EthereumTx({
						nonce: w3c.web3.utils.toHex(c),
						from: account.address,
						to: company_address,
						gas: w3c.web3.utils.toHex(500000),
						gasPrice: w3c.web3.utils.toHex(170000000),
						data: trx_encode
					}, {chain: 'rinkeby'});
					trx.sign(Buffer.from(account.privateKey.slice(2), "hex"));

					var serializedTrx = '0x' + trx.serialize().toString('hex');

					console.log("**CardCreation");
					console.log(card);

					w3c.web3.eth.sendSignedTransaction(serializedTrx).on('transactionHash', (hash) =>{
						resolve(hash);
					}).on('receipt', (receipt) =>{
						console.log(receipt);
					}).on('error', (e) =>{
						reject(e);
					});

				});
			});
		},

		purchaseCardEmail: (company_address, company_owner, position, secret) =>{
			return new Promise((resolve, reject) =>{
				w3c.getValidationArgs(w3c.gifterAccount.address, company_owner, 0).then((args) =>{
					console.log("**params**");
					console.log(w3c.gifterAccount.address);
					console.log(company_owner);
					console.log(company_address);
					console.log(position);
					console.log(w3c.web3.utils.fromAscii(secret));
					console.log(args[0]);
					console.log(args[1]);
					console.log(args[2]);
					console.log("**params**");
					var util = new w3c.web3.eth.Contract(contracts["CardUtil"]["abi"], contracts["CardUtil"]["address"]);
					var method = util.methods.purchaseCardEmail(
						w3c.gifterAccount.address,
						company_owner,
						company_address,
						position,
						w3c.web3.utils.fromAscii(secret),
						args[0], args[1], args[2]
					);
					var trx_encode = method.encodeABI();

					//Create event listener and send email here instead of in webhook to avoid emails sent on failiure

					w3c.web3.eth.getTransactionCount(w3c.gifterAccount.address).then(c =>{
						console.log("transaction count: " + c);

						var trx = new EthereumTx({
							nonce: w3c.web3.utils.toHex(c),
							from: w3c.gifterAccount.address,
							to: contracts["CardUtil"]["address"],
							gas: w3c.web3.utils.toHex(5000000),
							gasPrice: w3c.web3.utils.toHex(170000000),
							data: trx_encode
						}, {chain: 'rinkeby'});
						trx.sign(pk);

						var serializedTrx = '0x' + trx.serialize().toString('hex');

						w3c.web3.eth.sendSignedTransaction(serializedTrx).on('transactionHash', (hash) =>{
							resolve(hash);
						}).on('receipt', (receipt) =>{
							console.log(receipt);
						}).on('error', (e) =>{
							reject(e);
						});

					});
				});
			});
		}
	}
}