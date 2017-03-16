const mongoose          =   require('mongoose'),
    path                =   require('path'),
    config              =   require(path.resolve('./config/env/default')),
    crypto              =   require('crypto'),
    schema              =   mongoose.Schema;


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
    gender: String,
    trash: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'      
    }
});


/* perform action before save data into database*/

userSchema.pre('save', function (next) {

    this.auth = crypto.randomBytes(16).toString('hex');
    this.password = this.encryptPassword("One1");
    next();

});



/* encrypt password by using crypto and mongoose methods*/

userSchema.methods.encryptPassword = function(password) {

    return crypto.createHmac('sha512', config.secret).update(password).digest('base64');

};


/* match password by using crypto and mongoose methods*/

userSchema.methods.matchPassword = function(password) {

    return this.password === this.encryptPassword(password);

};


/* set statics to fetch result*/

userSchema.statics.findByEmail = function (email, cb) {

    return this.find(
        {
            'email' : email
        }, {
            email:1, 
            firstname:1
        }).exec(cb);

};


module.exports = mongoose.model('userModel', userSchema);