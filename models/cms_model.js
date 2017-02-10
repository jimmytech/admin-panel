var mongoose  = require('mongoose');
var schema = mongoose.Schema;

var cms = new schema({
	title: String,
	image: String,
	short_description: String,
	content: String,
	meta_title: String,
	meta_description: String,
	meta_keywords: String,
	top:Number,
	bottom: Number,
	slug: String,
	status: Number,
	sort: Number,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('cmsModel', cms);