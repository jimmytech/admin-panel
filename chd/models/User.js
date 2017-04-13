"use strict";

const mongoose = require('mongoose'),
    path = require('path'),
    crypto = require('crypto'),
    mail = require(path.resolve('./config/lib/mail')),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,

UserSchema 	= new Schema({
	profile_image:{
		name: {
			type: String,
			default: 'no-agent-image.jpg'
		},
		path: {
			type: String,
			default: 'images/'
		},
		original_name:  {
			type: String,
			default: 'no-agent-image.jpg'
		}
	},
	title:{
		type: String
	},
	display_as:{
		type: String
	},
	company:{
		type: String
	},
	firstname: {
		type: String,
		required: 'Firstname is required',
		maxlength: [20, 'Firstname cannot be more then {MAXLENGTH} characters.']
	},
	lastname: {
		type: String,
		maxlength: [20, 'Lastname cannot be more then {MAXLENGTH} characters.']
	},
	phone: {
		fax:{
			type: String,
			maxlength: [20, 'Fax number cannot exceeds than {MAXLENGTH} characters.']
		},
		daytime: {
			type: String,
			maxlength: [10, 'Phone number cannot exceeds than {MAXLENGTH} digits.']
		},
		evening: {
			type: String,
			maxlength: [10, 'Phone number cannot exceeds than {MAXLENGTH} digits.']
		},
		emergency: {
			type: String,
			maxlength: [10, 'Phone number cannot exceeds than {MAXLENGTH} digits.']
		},
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
		address2: {
			type: String
		},
		town: {
            type: String,
        },
        county: {
            type: String,
        },
        country: {
            type: String,
        },
		city: {type:String},
		state: {type:String},
		street_address: {type:String}		
	},
	correspondence_as_home: {
		type: Boolean,
		default: false
	},
	correspondence_address:{
		type: Object
	},
	bank: [{
		account_number: {
			type: Number,
			maxlength: [20, 'Account Number cannot exceed than {MAXLENGTH} digits.']
		},
		sortcode: {
			type: String,
			maxlength: [6, 'Sortcode cannot exceed than {MAXLENGTH} digits.']
		},
		account_name: String,
		reference: String,
		primary:{
			type: Boolean,
			default: false
		},
		created: {
			type: Date,
			default: Date.now
		}
	}],
	website_url: {type: String},
	reset_password: {type: Object},
	role: {
		type: String,
		enum: {
			values: ['landlord','subadmin', 'tenant', 'estateAgent', 'professionalTrader', 'franchisee'],
			message: '{VALUE} is not a valid role for user'
		},
		required: 'Please provide at least one role'
	},
	save_searches: [{
		frequency: {
			type: String,
			default: 'daily'
		},
		name: {
			type: String
		},
		last_sent: {
			type: Date,
			default: Date.now
		},
		prettyAddress: String,
		channel: String,
		filters: Object,
		created: {
			type: Date,
			default: Date.now
		}
	}],
	intrested_zip: {type: Array},
	save_property: {type: Array},
	email_verified: {
		type: Boolean,
		default: false
	},
	trademan_job_requests: {type: Array},
	badge: {type: String},
	plan: {
		type: String,
		default: 'basic'
	},
	tenancy_details: {type: Array},
	tenant_enquiries:[{
		email: String,
		name: String,
		phone: {
			telephone: {
				type: String,
			}	
		},
		about_me: String,
		comment: String,
		property_id: mongoose.Schema.Types.ObjectId,
		landlord_id: mongoose.Schema.Types.ObjectId,
		property_address: String,
		channel: String,
		get_an_indication_of_price: Boolean,
		inspect_the_property: Boolean,
		be_contacted_about_similar_properties: Boolean,
		status: {
			type: String,
			default: 'pending'
		},
		referencing: {
			type: String,
			default: 'pending'
		},
		created: {
			type: Date,
			default: Date.now
		}
	}],
	other_info: {type: String},
	email: {
		type: String,
		lowercase: true,
    	trim: true,
		unique: 'The Email address you have entered already exists.',
		uniqueCaseInsensitive:true,
		required: 'E-mail is required',
		validate: {
			validator: function(email) {
				return /^([\w-\.+]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
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
    allow_offer_news: {
		type: Boolean
	},
	created: {
		type: Date,
		default: Date.now
	},
	last_edited_by: {
		type: String
	},
    comment: {
    	type: String
	},
	salt: { type: String },
	auth: { type : String},
	visiting_charge: { type : String},
	deactivate: {
		type: Boolean,
		default: false
	}
});

/* Mongoose beforeSave Hook : To hash a password */
UserSchema.pre('save', function(next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        user.salt = crypto.randomBytes(16).toString('hex');
        user.password = this.hashPassword(config.salt, user.password);
        next();
    } else {
        return next();
    }
});


UserSchema.post('save', function(doc, next) {
    // do after save operations
    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(salt, password) {
    if (salt && password) {
        return crypto.createHmac('sha512', salt).update(password).digest('base64');
    } else {
        return password;
    }
};


/* To check a password */
UserSchema.methods.comparePassword = function(salt, password) {
    return this.password === this.hashPassword(salt, password);
};
UserSchema.set('autoIndex', config.db.autoIndex);
UserSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator'
});

module.exports = mongoose.model('User', UserSchema);