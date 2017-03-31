const mongoose = require('mongoose'), 
      uniqueValidator = require('mongoose-unique-validator'),
      schema = mongoose.Schema;

var faqSchema = new schema({
    question: String,
    meta_title: String,
    meta_content: String,
    meta_description: String, 
    meta_keywords: String,       
    short_description: String,       
    slug: {type: String, required: true, unique: true},
    answer: String,
    status: Boolean,
    sort: Number,
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

faqSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('faqModel', faqSchema);