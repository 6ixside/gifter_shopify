module.exports = () =>{
	return{
		checkSecurePassword: (password) =>{
			//check the password meets criteria, otherwise return false
			return true;
		},

		generateSecret: () =>{
			let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			let length = 20;
			let r = '';

			for(var i = 0; i < length; i++){
				r += chars.charAt(Math.floor(Math.random() * chars.length));
			}

			return r;
		}
	}
}