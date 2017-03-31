var mongoose = require('mongoose');
var schema = mongoose.Schema;

var storyBlogSchema = new schema({
    title: String,
    doc_type: String,
    meta_tittle: String,
    meta_content: String,
    meta_keyword: String,
    meta_description: String,
    meta_keywords: String,
    short_description: String,
    image: String,
    author: String,
    body: String,
    status: {
        type: Boolean,
        default: true
    },    
    postType: String,
    order: Number,
    trash: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'      
    }
});

module.exports = mongoose.model('blogModel', storyBlogSchema);