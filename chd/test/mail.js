'use strict';
process.env.NODE_ENV = 'test';

const path 		= require('path'),
	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	server 		= require(path.resolve('./server')),
	mail 		= require(path.resolve('./config/lib/mail')),
	chai 		= require('chai'),
	should 		= chai.should();

describe('Send Mail', function() {

	it('it should send a valid email via SMTP and return true', function(done) {
		let option = {
			to: 'yashsharma205@gmail.com'
		};

		mail.send({
			subject: 'New User Registration',
			html: './public/mail/user/mail.html',
			from: config.mail.from, 
			to: option.to,
			emailData : {
			    email: option.to,
			    href: `${config.server.host}:${config.server.PORT}/verifyEmail/xyz`
			}
		}, function(err, success){
			console.log(err);
			console.log(success.response.toString());
			done();
		});

	});	
});	