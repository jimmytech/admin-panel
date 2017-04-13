"use strict";

const mongoose 					= require('mongoose'),
	path 						= require('path'),
	crypto 						= require('crypto'),
	mail 						= require(path.resolve('./config/lib/mail')),
  	config 	 					= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	uniqueValidator 			= require('mongoose-unique-validator'),
	Schema 						= mongoose.Schema,

AdminSchema 	= new Schema({
	firstname: {
		type: String,
		maxlength: [20, 'Firstname cannot be more then {MAXLENGTH} characters.']
	},
	lastname: {
		type: String,
		maxlength: [20, 'Lastname cannot be more then {MAXLENGTH} characters.']
	},
	phone: {
		telephone: {
			type: String,
			maxlength: [10, 'Phone number cannot exceeds than {MAXLENGTH} digits.']
		}
	},
	address: {
		postcode: {
			type: String,
			maxlength: [9, 'Postcode cannot exceed than {MAXLENGTH} digits.']
		},
		address1: {
			type: String
		},
		city: {type:String},
		state: {type:String},
		street_address: {type:String}		
	},
	reset_password: {type: Object},
	role: {
		type: String,
		enum: {
			values: ['subadmin', 'superAdmin'],
			message: '{VALUE} is not a valid role for admin'
		},
		required: 'Please provide at least one role'
	},
    admin_type: {
        type: String,
		enum: {
			values: ['website', 'backoffice'],
			message: '{VALUE} is not a valid type for admin'
		},
		required: 'Please provide admin type'
    },
    admin_access: {
        type: String,
		enum: {
			values: ['poweruser', 'other'],
			message: '{VALUE} is not a valid role for admin'
		},
		required: 'Please provide admin access'
    },
	email_verified: {
		type: Boolean,
		default: false
	},
	other_info: {type: String},
	email: {
		type: String,
		lowercase: true,
    	trim: true,
		unique: 'The Email address you have entered already exists.',
		required: 'E-mail is required',
		validate: {
			validator: function(email) {
				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
			},
			message: '{VALUE} is not a valid email address'
		}
	},
	password: {
		type: String,
		required: 'Password is required',
		minlength: [6, 'Password must be atleast 6 characters long.']
	},
	status: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	last_edited_by: {
		type: String
	},
	salt: { type: String },
	auth: { type : String},
	deactivate: {
		type: Boolean,
		default: false
	},
	login_time: {
		type: String
	},
	logout_time: {
		type: String
	}
});

/* Mongoose beforeSave Hook : To hash a password */
AdminSchema.pre('save', function(next){
	let user = this;
	if(this.isModified('password') || this.isNew){
		user.salt = crypto.randomBytes(16).toString('hex');
		user.password = this.hashPassword(config.salt, user.password);
		next();
	} else {
		return next();
	}
});


AdminSchema.post('save', function(doc, next){
	// do after save operations
	next();
});	

/**
 * Create instance method for hashing a password
 */
AdminSchema.methods.hashPassword = function (salt, password) {
  if (salt && password) {
    return crypto.createHmac('sha512', salt).update(password).digest('base64');
  } else {
    return password;
  }
};


/* To check a password */
AdminSchema.methods.comparePassword = function(salt, password){
	return this.password === this.hashPassword(salt, password);
};
AdminSchema.set('autoIndex', config.db.autoIndex);
AdminSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });
module.exports = mongoose.model('Admin', AdminSchema);