const fs		=	require('fs'),
	path		= 	require('path'),
	msg			=	require(path.resolve('./config/libs/message')),
	decodeJwt   = require(path.resolve('./config/libs/verify_jwt')),
	mailer		=	require(path.resolve('./config/libs/mailer')),
	env      = 	require(path.resolve(`./config/env/${process.env.NODE_ENV}`));
	userModel	= 	require(path.resolve('./modules/frontend/models/user_model'));


exports.referToFriend = (req, res) => {
	   let secret = env.secret;
	   decodeJwt.run(req, secret, (data) => {

		let email = req.params.email;
		let template = data.promotional_code;
		let subject = "Promotional Code";

		mailer.sendEmail(email, template, subject,  (err, result) => {

			if (result) {
				res.json({
					success: true,
					message: msg.sent
				});
			}else{
				res.json({
					success: false,
					message: sent.tryAgain
				});					
			}
	

		});	   	
	   });


};