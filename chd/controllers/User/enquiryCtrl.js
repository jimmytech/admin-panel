'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	User 	 	= require(path.resolve('./models/User')),
	mail 	 	= require(path.resolve('./config/lib/mail')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	logger 		= require(path.resolve('./config/lib/logger')),
  	paginate    = require(path.resolve('./config/lib/paginate')),
  	response 	= require(path.resolve('./config/lib/response'));

// This function will save all tenants enquiries
exports.tenantEnquiry = (req, res, next) => {
	if(_.isEmpty(req.body)){
		return res.json(
            response.errors({
                message: 'No data received to update',
                success: false
            })
        );
	}
	let body = req.body;
	delete body._id;
	logger.log('info', body);
	async.waterfall([
		function (done) {
			User.count({ _id: req.params.landlordid, "tenant_enquiries.property_id": body.property_id, "tenant_enquiries.email": body.email },
				function(err, count) {
					done(err, count);
				}
			);
		},
		function (count, done) {
			if(count === 0){

				async.parallel([
					function (callback) {
						User.update({ _id: {$in: [req.params.landlordid, req.params.tenantid] }},
						{ $push: { tenant_enquiries: body } }, 
						{ runValidators: true, setDefaultsOnInsert: true, multi: true },
						function (err, result) {		
							callback(err, result);
						});		
					},
					function (callback) {
						// Mail for tenant
						mail.send({
							subject: `${body.property_address} Enquiry Sent`,
							html: './public/mail/user/enquiry.html',
							from: config.mail.from, 
							to: body.email,
							emailData : {
					   		    email: body.email,
					   		    name: body.name,
					   		    property_address: body.property_address,
					   		    landlord: body.landlord_user || 'User',
					   		}
						}, function (err, success) {
							callback(err, success);
						});
					},
					function (callback) {
						// Mail for landlord
						mail.send({
							subject: `${body.property_address} Property Enquiry Request`,
							html: './public/mail/user/landlord_enquiry.html',
							from: config.mail.from, 
							to: body.landlord_email,
							emailData : {
					   		    email: body.email,
					   		    name: body.name || 'User',
					   		    property_address: body.property_address,
					   		    landlord: body.landlord_user || 'User',
					   		    tenant: body.name,
					   		    comment: body.comment || ''
					   		}
						}, function (err, success) {
							callback(err, success);
						});
					}
				], function (err, success) {
					done(err, success);
				})
			} else {
				done(null, 'NOCHANGE');
			}
		}
	], function (err, result, success) {
	
		if(err) {
			return next(err);
		} 
		res.json(
			response.success({
				mailStatus: success,
				success: true,
	    		message: (result === 'NOCHANGE') ? 'You have already sent enquiry for this property':'Your request submitted successfully.'
			})
		);
		
	});
};

// This function will fetch all the enquiries
exports.getEnquiries = (req, res, next) => {
	let sortBy = req.query.sort || { "tenant_enquiries.created": -1 };
	let page = req.query.page || 1;
	async.parallel({
		count: function (callback) {
			User.aggregate([
				{ $project: { tenant_enquiries: 1, status: 1, deactivate:1 } },
				{ $match: { tenant_enquiries: { $ne: [] }, status: true, deactivate: false, _id: mongoose.Types.ObjectId(req.params.landlordid) } },
				{ $project: { _id: 0, tenant_enquiries_count: { $size: "$tenant_enquiries" }  } },
			], function (err, result) {
				let resultCount = _.isArray(result) && result.length > 0 ? result[0].tenant_enquiries_count : 0;
				callback(err, resultCount);
			});
		},
		enquiries: function (callback) {
			User.aggregate([
				{ $project: { tenant_enquiries: 1, status: 1, deactivate:1 } },
				{ $match: { tenant_enquiries: { $ne: [] }, status: true, deactivate: false, _id: mongoose.Types.ObjectId(req.params.landlordid) } },
				{ $unwind: "$tenant_enquiries" },
				{ $sort: sortBy },
				{ $skip: ( page-1 ) * config.docLimit },
				{ $limit: config.docLimit }
			], function (err, result) {
				callback(err, result);
			});		
		}
	},function (err, result) {
		if(err){
			return next(err);
		}
		res.json(
			response.success({
				records: result.enquiries,
				paging: paginate._paging(result.count, result.enquiries, page),
				success: true
			})	
		);
	});
};

// This function will toggle the status of enquiries
exports.toggleStatus = (req, res, next) => {
	let body = req.body;
	let setStatusText = { 'approve': 'approved', 'decline': 'declined' };
	let query;
	if(body.type === 'toggleStatus'){
		query = {$set: {"tenant_enquiries.$.status": setStatusText[body.status] } };
	} else if(body.type === 'referencing'){
		query = {$set: {"tenant_enquiries.$.referencing": body.referencing } };
	}
	async.parallel([
		function (callback) {
			User.update({ _id: req.params.landlordid, "tenant_enquiries.property_id": body.property_id },
			query,
			{ runValidators: true, setDefaultsOnInsert: true },
			function (err, response) {
				callback(err, response);
			});	
		},
		function (callback) {
			User.update({ email: body.tenant_email, "tenant_enquiries.property_id": body.property_id },
			query,
			{ runValidators: true, setDefaultsOnInsert: true },
			function (err, response) {
				callback(err, response);
			});
		}
	], function (err, success) {
		if(err){
			return next(err);
		}
		res.json(
			response.success({
				message: `Enquiry status updated successfully`,
				success: true
			})	
		);
	});	
};

exports.organizeReferencing = (req, res, next) => {
	console.log(req.params.landlordid);
};