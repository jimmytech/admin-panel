'use strict';
const path 		= require('path'),
	async 		= require('async'),
	Email 		= require(path.resolve('./models/EmailNotification')),
	paginate    = require(path.resolve('./config/lib/paginate')),
	config      = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	logger 		= require(path.resolve('./config/lib/logger'));


exports.getDeliveredEmails = function(req, res, next){
	if(req.body){
		var arr = req.body;
		Email.insertMany(arr, function(err, success){
			if(err){
				logger.log('info', 'emailCtrl', err);
			} else {
				res.json({
					success: true,
					message: 'Successfully'
				});
			}
		});
	} else {
		logger.log('info', 'emailCtrl', 'No data received');
	}
};

exports.getEmailList = (req, res, next) => {
    let page = req.query.page || 1;
    let searchByEmail = (req.query.email) ? {email: { $regex: req.query.email, $options: 'i'}} : {};
    let sortBy = {created: -1};

    async.parallel({
        count: function(callback) {
            Email.count(searchByEmail,function(err, count){
                callback(err, count);
            });
        },
        mails: function(callback) {
             // TODO - create index for userid later
            Email.find(searchByEmail)
            .sort(sortBy)
            .skip((page-1)*config.docLimit)
            .limit(config.docLimit)
            .exec(function (err, result) {
            	callback(err, result)
            });
        }
    }, function(err, result) {
        if(err){
            return next(err);
        }
        
        res.json({
                success: true,
                records: result.mails,
                paging: paginate._paging(result.count, result.mails, page) 
            }
        );
    });
};