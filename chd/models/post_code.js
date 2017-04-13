'use strict';
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,

    postCodeSchema = new Schema({
        postcode: {
            type: String,
            required: "Postcode is required",
            unique: 'This postcode you have entered already exists'
        },
        latitude: {
            type: String
        },
        longitude: {
            type: String
        },
        country: {
            type: String
        },
        county: {
            type: String
        },
        district: {
            type: String
        }
    }, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
postCodeSchema.plugin(uniqueValidator, {type: 'mongoose-unique-validator' });
module.exports = mongoose.model('postCode', postCodeSchema);