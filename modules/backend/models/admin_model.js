const mongoose          =   require('mongoose'),
    path                =   require('path'),
    config              =   require(path.resolve('./config/env/default')),
    crypto              =   require('crypto'),
    schema              =   mongoose.Schema;

    
var adminSchema = new schema({
    first_name: String,
    last_name: String,
    user_name: String,
    email: String,
    address: String,
    image: String,    
    password: String,
    key: String,
    role: String,
    auth: String,
    gender: String,
    created: {
        type: Date,
        default: Date.now
    }
});


adminSchema.pre('save', function (next) {

    this.auth = crypto.randomBytes(16).toString('hex');
    this.password = this.encryptPassword(this.password);
    next();

});



/* encrypt password by using crypto and mongoose methods*/

adminSchema.methods.encryptPassword = function(password) {
    // console.log(crypto.createHmac('sha512', config.secret).update(password).digest('base64'));
    return crypto.createHmac('sha512', config.secret).update(password).digest('base64');

};


/* match password by using crypto and mongoose methods*/

adminSchema.methods.matchPassword = function(password) {
    // console.log(this.encryptPassword(password));
    return this.password === this.encryptPassword(password);

};


module.exports = mongoose.model('adminModel', adminSchema);