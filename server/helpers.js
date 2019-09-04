var nodemailer = require('nodemailer');

module.exports = () =>{
	var mailTransport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: '6sidecontracting@gmail.com',
			pass: process.env.MAIL_PASS
		}
	}) 

	return{
		checkSecurePassword: (password) =>{
			//check the password meets criteria, otherwise return false
			return true;
		},

		sendGiftCard: (contents) =>{
			console.log("sending gift card");

			let mailOptions = {
				from: '6sidecontracting@gmail.com',
				to: contents.email,
				subject: 'Here is Your Gift Card!',
				html: '<p> Your Code is: <strong>' + contents.code + '</strong></p>'
			}

			mailTransport.sendMail(mailOptions, (err, info) =>{
				if(err)
					console.log(err);

				console.log(info);
			});
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