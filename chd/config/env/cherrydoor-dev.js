"use strict";
const config = {
	db: {
		URL: 'mongodb://localhost/cherrydoordev',
		DEBUG: true,
		log: true,
    autoIndex: true
	},
	server: {
		host: 'http://cherrydoor-dev.flexsin.org',
		PORT: 9000
	},
	log: {
		// logging with Morgan - https://github.com/expressjs/morgan
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
       	format: 'dev',
       	fileLogger: {
			directoryPath: `${process.cwd()}/logs`,
           	fileName: 'app.log',
           	maxsize: 10485760,
           	maxFiles: 2,
           	json: true
       	}
   	},
   	mail:{
   		poolConfig : {
		    pool: true,
		    host: 'smtp.gmail.com', // Gmail as mail client
		    port: 587,
		    secure: false, // use SSL
		    auth: {
		        user: 'flexsin.nodejs@gmail.com',
		        pass: 'flexsin@123'
		    },
		    ignoreTLS: true,
		    tls: {
		    	rejectUnauthorized: false
		    }
		},
		from: '"Cherrydoor" <flexsin.nodejs@gmail.com>'
   	},
   	sendgrid: {
   		auth: {
   			api_key: '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'
   		}
   	},
   	mailTransporter: 'sendgrid', // either sendgrid or gmail
   	salt: '51ca5acbce3e6a5b2dd9772b36cff34c',
   	secret: '876sdf&%&^435345(*^&^654sdsdc&^&kjsdfjbksdureyy3(&(*&(&7$%^#%#&^*(&)*)*',
   	allowed_image_extensions : ['image/jpeg','image/jpg','image/png','image/gif','image/bmp'],
    property_image_full_destination : './public/images/property/',
    property_image_display_path : 'images/property/',
    profile_image_destination: 'images/profile/',
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
    userRoles: {
      'estate-agent': 'estateAgent',
      'franchisee': 'franchisee',
      'professional-trader': 'professionalTrader',
      'landlord': 'landlord',
      'tenant': 'tenant',
      'subadmin': 'subadmin'
    },
  requestValidateKey: 'qwerty~@1%9>9<5@#$[}{=]?<_*&sz4$K2H%TdRV|qjs-tOn,jW.HyHg',
  paypalCrediantials: {
  clientId: "AdIfEdEaMpACtg10rcEimE7yPG9OzhfqJdbtqJi0CZftGvtM1dtdrHIYQgCQWSTVejKUAGBtumwifLyZ",
  clientSecret: "EM1-cZFzjd26sfqfyz-VGX6Si3xKcRyimOMGqfDNPBa1Hu0nVBa_hC-HQhGD9nckgtv1KK-mO3e12KPH"
},
emailLimit: 10  
};
module.exports = config;