var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    firstname: String,
    lastname: String,
    display_name: String,
    email: String,
    promotional_code: String,
    address: String,
    image: String,    
    password: String,
    user_type: String,
    auth: String,
    gender: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'      
    }
});

module.exports = mongoose.model('userModel', userSchema);