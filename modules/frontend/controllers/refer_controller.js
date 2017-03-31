const fs		=	require('fs'),
	path		= 	require('path'),
	jwt			=	require('jsonwebtoken'),
	msg			=	require(path.resolve('./config/libs/message')),
	mailer		=	require(path.resolve('./config/libs/mailer')),
	config      = 	require(path.resolve(`./config/env/${process.env.NODE_ENV}`));
	userModel	= 	require(path.resolve('./modules/frontend/models/user_model'));


exports.referToFriend = (req, res) => {

	let email = req.params.email;
	let template = "<b>Hello world ?</b>";
	let subject = "Hello ✔";

	mailer.sendEmail(email, template, subject,  (err, result) => {

		console.log(err);
		console.log(result);

		res.json({
			success: true
		});		

	});

};