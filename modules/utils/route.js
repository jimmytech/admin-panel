'use strict';
const multer			= require('multer'),
	path 				= require('path'),	
	conf				= require(path.resolve(`./config/env/development`)),
	crypto 				= require('crypto');

exports.saveImage = (data) => {
	return multer({    
	    storage: multer.diskStorage({
	    	destination: "public/assets/img/uploads",
	    	filename:  (req, file, cb)=> {
	    		cb(null, `${Date.now()}${crypto.randomBytes(6).toString('hex')}${conf.image_extensions[file.mimetype]}`);
	  		}
	    })    
	}).any();
};