'use strict';
 const mongoose 	= require('mongoose'),
 	schema			= mongoose.Schema;

 	let categorySchema = new schema ({
 		title: String,
 		description: String,
 		slug: String,
 		order: Number,
 		image: String,
 		status: Boolean,
 		trash: {
 			type: Boolean,
 			default: false
 		}
 	}, {
 		timestamps: {
 			createdAt: "created_at",
 			updatedAt: "updated_at"
 		}
 	});

 	module.exports = mongoose.model('categoryModel', categorySchema);