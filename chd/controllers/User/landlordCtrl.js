'use strict';

const path      = require('path'),
    _           = require('lodash'),
    config      = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    User        = require(path.resolve('./models/User')),
    async		= require('async'),
    mongoose 	= require('mongoose'),
    response 	= require(path.resolve('./config/lib/response'));

// Save and Edit bank detail
exports.landlordBankDetail = (req, res, next) => {
	if(_.isEmpty(req.body.bank)){
		return res.json(
            response.errors({
                message: 'No data received to update',
                success: false
            })
        );
	}
	let bankDetails = req.body.bank;
	let operation = {};
	if(_.hasIn(bankDetails, '_id')){
		operation = { 
			query: { _id: req.params.id, 'bank._id': bankDetails._id }, 
			operator: {
				$set: { 
					"bank.$.account_number": bankDetails.account_number,
					"bank.$.account_name": bankDetails.account_name,
					"bank.$.sortcode": bankDetails.sortcode,
					"bank.$.reference": bankDetails.reference,
					"bank.$.primary": bankDetails.primary,
				}
			} 
		};
	} else {
		operation = {
			query: { _id: req.params.id },
			operator: { $push: { bank: bankDetails } }
		};
	}	
		

	User.update(operation.query,operation.operator,
	{ runValidators: true, setDefaultsOnInsert: true },
	function (err, result) {
		if(err){
			return next(err);
		}
		res.json(
			response.success({
				success: true,
        		message: 'Bank details update successfully'
			})	
        );
	});
		
};

// Delete bank details
exports.landlordDeleteBankDetail = (req, res, next) => {
	User.update({_id: req.params.userid},
	{ $pull: { bank: { _id: mongoose.Types.ObjectId(req.params.id) } } },
	function (err, result) {
		if(err){
			return next(err);
		}
		res.json(
			response.success({
				success: true,
        		message: 'Bank details deleted successfully'
			})	
        );
	});
};

// Set primary bank detail
exports.makePrimaryBankDetail = (req, res, next) => {
	let userid = req.params.userid;
	if( _.isEmpty(req.body.bank) ){
		return res.json(
            response.errors({
                message: 'No data received to update',
                success: false
            })
        );
	}
	let bankDetail = req.body.bank;

	async.waterfall([
		function (done) {
			User.findOne({ _id: userid }, { bank: 1 },function(err, result){
				done(err, result);
			});
		},
		function (result, done) {
			
			async.each(result.bank, function(bank, callback){
				let opt = false;
				if( _.isEqual(bank._id, mongoose.Types.ObjectId(bankDetail._id)) ){
					opt = true;
				}
				User.update({ _id: userid, 'bank._id': bank._id },
				{ $set: { "bank.$.primary": opt } },
				function (err, result) {
					callback(err);
				});
			}, function(err){
				done(err, 'success');
			});
		}
	], function (err) {
		if(err){
			return next(err);
		}
		res.json(
			response.success({
				success: true,
        		message: 'Bank details update successfully'
			})	
        );
	});
};