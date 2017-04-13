"use strict";

const mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    Schema = mongoose.Schema,

CronQueueSchema = new Schema({
	property: Array,
    exclusive_key: { 
        type: String, 
        unique: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: String,
    frequency: String,
    status: {
        type: String,
        enum: {
            values: ['inqueue','pending', 'processed', 'delivered'],
            message: '{VALUE} is not a valid status'
        },
        default: 'inqueue'
    }
},{
    capped: { size: 10485760, autoIndexId: true },
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

module.exports = mongoose.model('CronQueue', CronQueueSchema);