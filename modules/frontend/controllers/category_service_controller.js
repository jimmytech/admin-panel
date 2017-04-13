const path 			= require('path'),
	async           = require('async'),
    msg 			= require(path.resolve('./config/libs/message')),
    decodeJwt		= require(path.resolve('./config/libs/verify_jwt')), 
    userModel		= require(path.resolve('./modules/frontend/models/user_model')),   
    serviceModel 	= require(path.resolve('./modules/backend/models/service_model')),
    categoryModel 	= require(path.resolve('./modules/backend/models/category_model')),
    env 			= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));

exports.categoryServiceList = (req, res) => {

	async.parallel({

		category: (cb) => {
				categoryModel.find({
					trash: false,
					status: true
				}, {
					updated_at: 0,
					created_at:0,
					trash:0,
					status:0,
					__v:0,
				}).sort('order').exec((err, result) => {
					cb(null, result);
				});			
		},

		service: (cb) => {
				serviceModel.find({
					trash: false,
					status: true					
					}, {
						updated_at: 0,
						created_at:0,
						trash:0,
						status:0,
						__v:0						
					}).sort('order').exec((err, result) => {
					cb(null, result);
				});				
		}
	}, (err, result) => {
			res.json({
				success: true,
				result: result
			});
	});
};

exports.saveCategoryInfo = (req, res) => {

	    let secret = env.secret;

		decodeJwt.run(req, secret, (data) => {
			userModel.update({

				"_id": data._id

			}, {
				"$push": {
					"categories": {
						"$each": ['req.body.category']
					}
				}
			}, {
				"$set": {
					"travel_distance": req.body.travel_distance
				}
			}, (err, result) => {
				console.log(err||result);
			});
		});

		res.json({success: true});
};