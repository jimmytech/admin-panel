'use strict';

const mongoose = require('mongoose'),
	Schema = mongoose.Schema,

paymentSchema = new Schema({
	email: {
		type: String
	},
	property_id: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
	},
	mc_gross: {
		type: String
	},
	payer_email: {
		type: String
	},
	receiver_email: {
		type: String
	},
	payer_business_name: {
		type: String
	},
	payment_type: {
		type: String
	},
	payment_date: {
		type: String
	},
	address_country_code: {
		type: String
	},
	txn_id: {
		type: String
	},
	num_cart_items: {
		type: String
	},
	mc_fee: {
		type: String
	},
	payment_status: {
		type: String
	},
	payer_status: {
		type: String
	},
	business: {
		type: String
	},
	item: {
		type: Array
	}
},{
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});	

module.exports = mongoose.model('Payment', paymentSchema);