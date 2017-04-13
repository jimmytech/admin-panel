'use strict';
const mongoose = require('mongoose'),
    path = require('path'),
    crypto = require('crypto'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,

    requestSchema = new Schema({
        type: {
            type: String,
            required: "Type is required"
        },
        firstname: {
            type: String,
            required: "Firstname is required"
        },
        lastname: {
            type: String,
            required: "Lastname is required"
        },
        email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: 'Sorry! You are trying to request again.',
        uniqueCaseInsensitive:true,
        required: 'E-mail is required',
        validate: {
            validator: function(email) {
                return /^([\w-\.+]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
            },
            message: '{VALUE} is not a valid email address'
        }
        },
        address: {
            type: String,
            required: "Address is required"
        },
        phone: {
            telephone: {
                type: String,
                maxlength: [10, 'Phone number cannot exceeds than {MAXLENGTH} digits.']
            }
        },       
        notes: {
            type: String
        },
        intrested_zip: {
            type: Array,
            required: "Zip code is required"
        },
        company: String
    }, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
requestSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });
module.exports = mongoose.model('request', requestSchema);