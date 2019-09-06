var Web3 = require("web3"); 

(async () =>{
	let web3 = await new Web3(new Web3.providers.WebsocketProvider("https://rinkeby.infura.io/ws"), null, {});

	let hash1 = "0x1d6d1c1132556d0366775070ccc7a3fa15b20c4c6953239549fd6680b9438fe1"
	let hash2 = web3.utils.soliditySha3('\x19Ethereum Signed Message:\n32', hash1);

	let sig = "0xae6fc7359d4a07119cd88bf484e8f50232135871a913501299f0069f381cecb249749cc11c400fe91e7638d0bc2d38b1311656b6c0760e2505ec1d10134747d51b"

	let r = sig.substr(0, 66);
	let s = '0x' + sig.substr(66,64);
	let v = '0x' + sig.substr(130, 2);

	console.log(web3.eth.accounts.recover(
		hash2, 
		v,
		r,
		s)
		//"0x1b", 
		//"0xc322de6e8cb3ed30ab92cf6e52965af15be8c6e2c7faa41edcbe69a7054e9cff", 
		//"0x333cee0d31fd78d800605c9414d6f5ec7a2b47750a72a36aab0f4bbc84da7b63")
	);
	
})();
