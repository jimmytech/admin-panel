'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    SubsCriptionPlanSchema = new Schema({
        name: {
            type: String,
            required: 'Please provide plan name'
        },
        price: Number,
        type: String,                               
        having_service: Array,
        plan_description: String,
        status: {
                type: Boolean,
                default: false
            }, 

        additional_services: [{
            name: String,
            price: Number,
            status: {
                type: Boolean,
                default: false
            }, 
            description: String,
            tooltip_text: String,
            createdAt: {
                type: Date,
                default: Date.now
            },            
        }],

        services: [{
            name: String,
            status: {
                type: Boolean,
                default: false
            }, 
            createdAt: {
                type: Date,
                default: Date.now
            },            
        }
        ]
    },
    {timestamps: { createdAt: 'createdAt' }}
    );

module.exports = mongoose.model('SubsCriptionPlan', SubsCriptionPlanSchema);