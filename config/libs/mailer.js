'use strict';
const nodemailer		 = require('nodemailer'),
	path				 = require('path'),
	config               = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


exports.sendEmail = (emailId, template, subject, cb) =>{

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email,
            pass: config.password
        }
    });

    let mailOptions = {
        from: `Peache <${config.email}>`,
        to: emailId, 
        subject: subject, 
        html: template 
    };

    transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
            cb(error, undefined);
        }else{
            cb(null, info);
        }

    });      

};




