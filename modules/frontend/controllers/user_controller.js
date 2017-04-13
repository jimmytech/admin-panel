const fs		=	require('fs'),
	path		= 	require('path'),
	jwt			=	require('jsonwebtoken'),
	crypto		=   require('crypto'),
	msg			=	require(path.resolve('./config/libs/message')),
	key         = 	require(path.resolve(`./config/env/${process.env.NODE_ENV}`));
	userModel	= 	require(path.resolve('./modules/frontend/models/user_model'));



exports.signup = (req, res) =>{
	let userInfo = req.body;
		userInfo.promotional_code = `${userInfo.display_name.substring(0,6)}${crypto.randomBytes(3).toString('hex')}`;

	let data = new userModel(userInfo);

	data.save((err, result)=>{
		if (result) {

			res.json({
				success: true,
				message: msg.signup
			});

		}else{

			res.json({
				success: false,
				message: msg.tryAgain
			});

		}
	});

};	


exports.login = (req, res) => {

	userModel.login(req.body, (err, result) => {

		if (result){

			let token = jwt.sign(result, new Buffer(key.secret).toString('base64'));
			res.json({
				success: true,
				message: "",
				user: result,
				token: token
			});

		} else {

			res.json({
				success: false,
				message: msg.invalidUser,
				errors: err
			});

		}
	});

};	

exports.updateProfile = (req, res) => {

	let obj  = req.body;
	userModel.update({
		"_id": obj._id
	}, obj , (err, result) => {

		if (result.nModified == "1") {
			res.json({
				success: true,
				message: msg.updated
			});
		}else{
			res.json({
				success: false,
				message: msg.tryAgain
			});			
		}
	});

};

