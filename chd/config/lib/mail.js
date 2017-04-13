"use strict";

const nodemailer	= require('nodemailer'),
	path 			= require('path'),
	config 			= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	fs 				= require('fs'),
	stubTransport 	= require('nodemailer-stub-transport'),
	sgTransport 	= require('nodemailer-sendgrid-transport'),
	template 		= require(path.resolve('./config/lib/template-render')),
	logger 			= require(path.resolve('./config/lib/logger'));

// Send mail by GMAIL SMTP
function gmailSMTP(opt, cb) {
	var poolConfig = config.mail.poolConfig,
	transporter = nodemailer.createTransport(poolConfig);
	sendMailer(opt, transporter, cb);
}

// Using sendgrid SMTP
function sendgridSMTP(opt, cb) {
	var sendgrid 	= config.sendgrid,
	transporter 	= nodemailer.createTransport(sgTransport(sendgrid)),
	htmlTemplate 	= template.render(fs.readFileSync(opt.html, 'utf-8'), null, opt.emailData),
	attachmentsArr 	= opt.attachments !== undefined ? [opt.attachments] : [],
	email = {
	    to: opt.to,
	    from: opt.from,
	    subject: opt.subject,
	    text: 'Unable to send HTML',
	    html: htmlTemplate,
	    attachments: attachmentsArr
	};
	
	transporter.sendMail(email, cb);
}

/* if we are testing don't send out an email instead return
* success and the html strings for inspection
*/
function stubMail(opt, cb) {
	var transporter = nodemailer.createTransport(stubTransport());
	sendMailer(opt, transporter, cb);
}

function sendMailer(opt, transporter, cb) {
	var newUserRegistration = transporter.templateSender({
		subject: opt.subject || 'New Mail',
		html: fs.readFileSync(opt.html, 'utf-8'),
	}, {
		from: opt.from || config.mail.from, // sender address
	});
	transporter.verify((error, success) => {
	   	if (error) {
	        cb(error);
	   	} else {
	   		// use template based sender to send a message
	   		newUserRegistration({
	   		    to: opt.to
	   		}, opt.emailData, (err, info) => {
	   		    if(err){
	   		        cb(err);
	   		    }else{
	   		    	if (process.env.NODE_ENV === 'test') {
	   		    		console.log(info.response.toString());
	   		    	}
	   		    	cb(err, info);
	   		    }
	   		});
	   	}
	});
}

exports.send = function (opt, cb) {
	if (process.env.NODE_ENV === 'test') {
		stubMail(opt, cb);
	} else {
		if (config.mailTransporter === 'sendgrid'){
			sendgridSMTP(opt, cb);
		} else if (config.mailTransporter === 'gmail') {
			gmailSMTP(opt, cb);	
		} else {
			cb('Unknown transporter, check your config', null);
		}
	}
};