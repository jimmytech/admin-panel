var mongoose = require('mongoose');
var schema = mongoose.Schema;

var user = new schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    address: String,
    image: String,    
    password: String,
    key: String,
    role: String,
    auth: String,
    gander: String,
    created: {
        type: Date,
        default: Date.now
    }
});

exports.userModel = mongoose.model('userModel', user);