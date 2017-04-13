"use strict";

const mongoose 	= require('mongoose'),
	path 		= require('path'),
  	config 	 	= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	Schema 		= mongoose.Schema,
	
EmailNotificationSchema = new Schema({
	sg_message_id: String,
	sg_event_id: {
		type: String,
		// unique: true // todo task - will do later
	},
	timestamp: String,
	event: String,
	email: String,
	category: String,
	response: String,
	attempt: Number,
	useragent: String,
	ip: String,
	url: String,
	created: {
		type: Date,
		default: Date.now
	}
},{
	capped: { size: 10485760, autoIndexId: true },
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

module.exports = mongoose.model('EmailNotification', EmailNotificationSchema);