const mongoose = require('mongoose'), 
      uniqueValidator = require('mongoose-unique-validator'),
      schema = mongoose.Schema;

var faq = new schema({
    question: String,
    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    slug: {type: String, required: true, unique: true},
    answer: String,
    status: Number,
    sort: Number,
    created: {
        type: Date,
        default: Date.now
    }
});
faq.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
exports.faqModel = mongoose.model('faqModel', faq);