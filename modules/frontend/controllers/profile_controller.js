const fs		=	require('fs'),
	path		= 	require('path'),
	jwt			=	require('jsonwebtoken'),
	msg			=	require(path.resolve('./config/libs/message')),
	key         = 	require(path.resolve(`./config/env/${process.env.NODE_ENV}`));
	userModel	= 	require(path.resolve('./modules/frontend/models/user_model'));


exports.changePassword = (req, res) => {

	let data  = req.body;

	userModel.findOne({

		"_id": data._id

	}, {

		password:1,
		_id:0

	}, (err, result) => {

		if (result) {

			if (result.matchPassword(data.p)) {

				let encryptedPassword = result.encryptPassword(data.np);
				let obj = {
					password: encryptedPassword
				};

				userModel.update({
					"_id": data._id
				}, obj, (err, update) => {

					if (update.nModified == "1") {
						res.json({
							success: true,
							message: msg.passwordChanged
						});							
					}else{
						res.json({
							success: false,
							message: msg.tryAgain
						});						
					}
				});

			}else{

				res.json({
					success: false,
					message: msg.invalidCurrentPassword
				});	

			}

		}else{

			res.json({
				success: false,
				message: msg.invalidRequest
			});			
		}
	});
};


exports.activeInactive = (req, res) => {

	userModel.update({
		"_id": req.body._id
	}, {
		"$set": {
			isActive: req.body.isActive
		}
	}, (err, result) => {

		if (result.nModified == "1") {
			
				let message = !req.body.isActive ? msg.accountDeactivated : msg.accountActivated;

				res.json({
					success: true,
					message: message
				});	

		}else{

				res.json({
					success: false,
					message: msg.tryAgain
				});	

		}

	});
};	

exports.activeInactiveNotification = (req, res) => {

	userModel.update({
		"_id": req.body._id
	}, {
		"$set": {
			enableNotification: req.body.enableNotification
		}
	}, (err, result) => {

		if (result.nModified == "1") {
			
				let message = !req.body.enableNotification ? msg.disableNotification : msg.enabledNotification;

				res.json({
					success: true,
					message: message
				});	

		}else{

				res.json({
					success: false,
					message: msg.tryAgain
				});	

		}

	});	

};
