var mongoose = require('mongoose');
var schema = mongoose.Schema;

var testimonial = new schema({
    name: String,
    image: String,
    category: Array,
    assigned_category: String,
    content: String,
    body: String,
    status: Number,
    sort: Number,
    type: String,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('testimonialModel', testimonial);