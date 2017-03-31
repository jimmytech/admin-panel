const mongoose          =   require('mongoose'),
    path                =   require('path'),
    config              =   require(path.resolve('./config/env/default')),
    crypto              =   require('crypto'),
    schema              =   mongoose.Schema;


var userSchema = new schema({
    first_name: String,

    last_name: String,
    
    display_name: String,

    country_code: String,

    mobile_number: String,

    email: String,

    promotional_code: String,

    address: String,

    image: String, 

    password: String,

    auth: String,

    gender: String,

    country: String,

    state: String,

    subrub: String,

    zip_code: String,

    dob: String,

    biography: String, 

    isActive: {
        type: Boolean,
        default: true
    },

    enableNotification: {
        type: Boolean,
        default: true
    },

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
    this.password = this.encryptPassword(this.password);
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

userSchema.statics.login = function(data, cb) {

    let password =  this.schema.methods.encryptPassword(data.password);

    return this.findOne(

        {
            "email": data.email,
            "password": password

        }, {
            password:0,
            auth:0
        }).exec(cb);

};


module.exports = mongoose.model('userModel', userSchema);