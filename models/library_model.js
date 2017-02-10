var mongoose = require('mongoose');
var schema = mongoose.Schema;

var library = new schema({
    name: String,
    image: String,
    category: Array,
    cat_id: String,
    sub_cat_id: String,
    post: Array,
    short_description: String, 
    label: Array,
    content: String,
    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    body: String,
    status: Number,
    sort: Number,
    type: String,
    created: {
        type: Date,
        default: Date.now
    }
});
exports.libraryModel = mongoose.model('libraryModel', library);

