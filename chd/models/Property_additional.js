'use strict';

const mongoose				= require('mongoose'),
		path				= require('path'),
		config				= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
		Schema				= mongoose.Schema,

propertyAdditionalSchema = new Schema ({
	type: {
		type: String
	},

	additional_exclusion: [{
		name: String,
		exclusion_type: String,		
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}],

	additional_feature: [{
		name: String,
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}],
	property_type: [{
		name: String,
		option_type: String,	
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}],
	heating: [{
		name: String,
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}		
	}],
	location: [{
		name: String,
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}			
	}],
	authority: [{
		name: String,
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}		
	}],
	age: [{
		name: String,
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}	
	}],
	style: [{
		name: String,
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}		
	}],
	parking: [{
		name: String,
		status: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			default: Date.now
		}		
	}]
},{
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});	
module.exports = mongoose.model('propertyAdditional', propertyAdditionalSchema);	