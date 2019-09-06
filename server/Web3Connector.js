var Web3 = require("web3"); 
var helpers = require("./helpers")();

module.exports = class Web3Connector{
	constructor(opts = {}){
		this.web3 = new Web3(new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws"), null, opts);
		this.web3.eth.net.isListening().then((active) =>{
			if(!active)
				throw new Error('Could not connect to provider');

			this.gifterAccount = this.web3.eth.accounts.privateKeyToAccount("0x" + process.env.PRIVATE_KEY);
			//this.gifterAccount.privateKey = null;

			console.log(this.gifterAccount.address);
		});
	}

	//creates a new account for when a new gifter company is made
	createAccount(password){
		return new Promise((resolve, reject) =>{
			if(!helpers.checkSecurePassword(password))
				reject("Password insecure");

			var account = this.web3.eth.accounts.create();
			var encrypt = this.web3.eth.accounts.encrypt(
				account.privateKey,
				password
			);

			resolve({
				account: account,
				encrypt: encrypt
			});
		});
	}

	//decrypt the account
	decryptAccount(account, password){
		return this.web3.eth.accounts.decrypt(account, password);
	}

	//default unlock for 2 minutes
	unlockAccount(account = null, pk = null, duration = 120){
		return new Promise((resolve, reject) =>{
			//if no account is passed, then assume gifter account (may switch later for security)
			if(!account){
				account = process.env.PUBLIC_KEY;
				pk = process.env.PRIVATE_KEY;
			}

			this.web3.unlockAccount(account, pk, duration).then((res) => {
				console.log(res);
				resolve();
			}).catch((error) =>{
				console.log(error);
				reject();
			});
		});
	}

	//lock account after action is performed
	lockAccount(account = null){
		return new Promise((resolve, reject) =>{
			//if no account is passed, then assume gifter account (may switch later for security)
			if(!account)
				account = process.env.PUBLIC_KEY;

			this.web3.lockAccount(account).then((res) => {
				console.log(res);
				resolve();
			}).catch((error) =>{
				console.log(error);
				reject();
			});
		});
	}

	getValidationArgs(a, b, nonce){
		//create validation objects
		let aObj = {t: 'address', v:a};
  	let bObj = {t: 'address', v:b};
  	let nonceObj = {t: 'uint', v:nonce};

  	//create hashes
  	let hash1 = this.web3.utils.soliditySha3(aObj, bObj, nonceObj);
		let hash2 = this.web3.utils.soliditySha3('\x19Ethereum Signed Message:\n32', hash1);

		console.log("hash1");
		console.log(hash1);

		console.log("hash2");
		console.log(hash2);

		return new Promise((resolve, reject) =>{
			try{
				let data = this.gifterAccount.sign(hash2);
				let sig = data.signature;

				let r = sig.substr(0, 66);
				let s = '0x' + sig.substr(66,64);
				let v = '0x' + sig.substr(130, 2);

				console.log(this.web3.eth.accounts.recover(hash2, v, r, s));

				resolve([[v], [r], [s]]); //temporarily nesting arrays
			} catch(e){
				reject(e);
			}
		});
	}
}