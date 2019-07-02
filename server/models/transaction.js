var ethereumTx = require('ethereumjs-tx');
var ethereumUtil = require('ethereumjs-util');

var contracts = {
	"CompanyFactory": {
		"abi": "../../contracts/CompanyFactory.abi",
		"address": "0xa0ce319e9674778c78378369a311ec0a38008c5a"
	}
}

module.exports = (w3c) =>{
	return{
		createNewCompany: (name, password) => {
			var cf = new w3c.web3.eth.Contract(contracts["CompanyFactory"]["abi"], contracts["CompanyFactory"]["address"]);

			return new Promise((resolve, reject) =>{
				if(name.length > 32)
					reject({error: "Company name must be less than 32 characters"});

				//create a new account on the blockchain to own the company
				w3c.createAccount(password).then((account) =>{
					var method = cf.methods.createNewCompany(web3.utils.asciiToHex(name), account.address);
					var trx_encode = method.encodeABI();

					var trx = ethereumTx({
		    		nonce: w3c.web3.utils.toHex(0), //nonce is 0 after account creation
		    		from: w3c.gifterAccount.address,
		    		to: contracts["CompanyFactory"]["address"],
		    		data: trx_encode
		    	});
					trx.sign(process.env.PRIVATE_KEY);

					var serializedTrx = '0x' + trx.serialize().toString('hex');

					w3c.web3.eth.sendSignedTransaction(serializedTrx, (err, res) =>{
						if(err)
							reject(err);

						resolve(res);
					}).on('transactionHash', function(hash){
					    console.log('hash: ' + hash);
					}).on('receipt', function(receipt){
					    console.log('receipt: ' + receipt);
					}).on('confirmation', function(confirmationNumber, receipt){
						console.log('confirmation number: ' + confirmationNumber);
					}).on('error', console.error);

				}, (err) =>{
					reject(err);
				});
			});
		}
	}
}