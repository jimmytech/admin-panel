/*jshint esversion: 6 */
/*jshint node: true */
"use strict";
const config = {
	db: {
		URL: 'mongodb://localhost/cherrydoortest',
		DEBUG: false,
		log: false,
    autoIndex: true
	},
	server: {
		PORT: 5000
	},
	log: {
		// logging with Morgan - https://github.com/expressjs/morgan
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
       	format: 'tiny',
       	fileLogger: {
			directoryPath: `${process.cwd()}/logs`,
           	fileName: 'app.log',
           	maxsize: 10485760,
           	maxFiles: 2,
           	json: false
       	}
   },
   mail:{
   		poolConfig : {
		    pool: true,
		    host: 'smtp.gmail.com', // Gmail as mail client
		    port: 25,
		    secure: true, // use SSL
		    auth: {
		        user: 'flexsin.php@gmail.com',
		        pass: 'flexsin@123'
		    }
		},
		from: '"Flexsin Tech " <flexsin.php@gmail.com>'
   	},
   	salt: '51ca5acbce3e6a5b2dd9772b36cff34c',
   	secret: '876sdf&%&^435345(*^&^654sdsdc&^&kjsdfjbksdureyy3(&(*&(&7$%^#%#&^*(&)*)*',
   	allowed_image_extensions : ['image/jpeg','image/jpg','image/png','image/gif','image/bmp'],
   	property_image_full_destination : './public/images/property/',
   	property_image_display_path : 'images/property/',
   	file_extensions : {
   		'image/jpeg' : 'jpg',
   		'image/jpg' : 'jpg',
   		'image/png' : 'png',
   		'image/gif' : 'gif',
   		'image/bmp' : 'bmp',
   	},
   	/*In case no property image found or upload */
   	image_path: 'images/',
   	image_name: 'noimage.jpg',
   	fileLimits: {
        fileSize: 2000000, //the max file size (in bytes)
        files: 10 //the max number of file
    },
	docLimit: 10,
    userManagementLimit: 10,
    requestValidateKey: 'qwerty~@1%9>9<5@#$[}{=]?<_*&sz4$K2H%TdRV|qjs-tOn,jW.HyHg',
};
module.exports = config;