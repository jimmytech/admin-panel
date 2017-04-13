var mongoose  = require('mongoose');
var schema = mongoose.Schema;


var suburbSchema = new schema({
	postcode: String,
	suburb: String,
	state: String,
	dc: String,
	type: String,
	lat: String,
	lon: String,
}, {
	timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at' 		
	}
});

module.exports = mongoose.model('suburbModel', suburbSchema);