var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

var contracts = {
	"CompanyFactory": {
		"abi": "../../contracts/CompanyFactory.abi",
		"address": "0x5c75159b92ecdf2c94cb951f00a779755d50c9a3"
	}
}

module.exports = () =>{
	//initial setup to unlock gifter eth account




	return{
		createNewCompany: (name) => {
			cf = new this.web3.eth.Contract(contracts["CompanyFactory"]["abi"], contracts["CompanyFactory"]["address"]);

			return new Promise((resolve, reject) =>{
				if(name.length > 32)
					reject({error: "Company name must be less than 32 characters"});

				var method = cf.methods.createNewCompany(web3.utils.asciiToHex(name));
				var trx_encode = method.encodeABI();
				var nonce = await this.web3.eth.getTransactionCount();
			});
		}
	}
}