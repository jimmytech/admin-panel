'use strict';

const crypto			= require('crypto'),
	path				= require('path'),
	userModel			= require(path.resolve('./models/user_model'));




	// function createUser() {
	// 	for(var i=0;i<11;i++){
	// 		var obj = {
	// 			firstname: crypto.randomBytes(7).toString('hex'),
	// 			lastname: crypto.randomBytes(3).toString('hex'),
	// 			display_name: crypto.randomBytes(3).toString('hex'),
	// 			address: crypto.randomBytes(10).toString('hex'),
	// 			auth: crypto.randomBytes(5).toString('hex'),
	// 			email: `${crypto.randomBytes(3).toString('hex')}@gmail.com`,
	// 			gender: 'male',
	// 			user_type: "c",

	// 		};

	// 		let data = new userModel(obj);
	// 		data.save((err, result)=>{
	// 			console.log(err||result);
	// 		});	
	// 	}
	// }
	
	// createUser();
