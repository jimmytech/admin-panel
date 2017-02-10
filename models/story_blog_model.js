var mongoose = require('mongoose');
var schema = mongoose.Schema;

var storyBlogSchema = new schema({
    title: String,
    type: String,
    meta_tittle: String,
    meta_content: String,
    meta_keyword: String,
    meta_description: String,
    meta_keywords: String,
    short_description: String,
    image: String,
    // author: String,
    body: String,
    status: Number,
    postType: String,
    sort: Number,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('blogStoryModel', storyBlogSchema);