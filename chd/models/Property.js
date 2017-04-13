'use strict';

const mongoose  = require('mongoose'),
    path        = require('path'),
    config      = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    _           = require('lodash'),
    crypto      = require('crypto'),
    Schema      = mongoose.Schema;

let PropertySchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image:{
        type: Array
    },    
    floor_plan:{
        type: Array
    },
    default_image: {
        type: Object,
        default: {
            path: config.image_path,
            name: config.image_name,
            thumb_path: config.image_path,
            thumb_name: config.image_name,
            original_name: config.image_name    
        }
    },
    cover_photo: {
        type: Object
    },
    owner: {
        type: String,
        required: [true, 'owner is required']
    },
    property_type: {
        type: Object,
        name: String,
        _id: mongoose.Schema.Types.ObjectId,
        required: [true, 'property type is required'],
    },
    parking: {
        type: Object,
        name: String,
        _id: mongoose.Schema.Types.ObjectId,
        required: [true, 'parking type is required']
    },
    heating: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    age: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    style: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    location: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    local_authority: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    beds: {
        type: Number,
        required: [true, 'number of beds is required']
    },
    bathroom: {
        type: Number,
        required: [true, 'Number of bathrooms required']
    },
    address: {
        address1: {
            type: String,
            required: [true, 'address 1 is required'],
            trim: true
        },
        address2: {
            type: String,
            trim: true
        },
        house_number: {
            type: String,
            required: [true, 'house number is required']
        },
        town: {
            type: String,
            required: [true, 'town is required']
        },
        county: {
            type: String,
            required: [true, 'county is required']
        },
        postcode: {
            type: String,
            required: [true, 'postcode is required']
        },
        latitude:{ 
            type: String
        },
        longitude: {
            type: String
        },
        loc: {
            type: Object
        }
    },
    furnished: {
        type: String,
        required: [true, 'furnished option is required']
    },
    epc_rating: {
        type: String,
        required: [true, 'epc rating is required']
    },
    features: {
        type: Array
    },
    available_date: {
        type: Date,
        required: [true, 'earliest date is required']
    },
    monthly_rent: {
        type: Number
    },
    weekly_rent: {
        type: Number
    },
    deposit_amount: {
        type: Number
    },
    minimum_tenancy_length: {
        type: Number
    },
    tenancy_agreement_length: {
        type: Number
    },
    viewing_date: {
        type: Date     
    },
    additional_exclusion: {
        type: Object
    },
    external_photo_url: {
        type: String,
        match:  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
        message: 'Invalid Phtoto URL'
    },
    youtube_url: {
        type: String,
        match: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/,
        message: 'Invalid youtube url'
    },
    paid_services: {
        type: Array,
    },
    cart: {
        type: Array,
    },
    agree_terms: {
        type: Boolean,
        required: [true, 'agree term is required']
    },
    description: {
        type: String,
        //minlength: [600, 'Description must be atleast {MINLENGTH} characters long.']
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    property_for: {
        type: String,
        required: [true, 'You must specify is property for sale or rent']
    },
    sale_price: {
        type: Number
    },
    under_offer:{
        type: Boolean
    },
    sold_stc:{
        type: Boolean
    },
    reserved:{
        type: Boolean
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true
    },
    let_agreed: {
        type: Boolean,
        default: false
    },
    upload_by: {
        type: String,
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    floor_plan_service: {
        type: Boolean,
        default: false
    }    
},{
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

PropertySchema.pre('save', function(next){
    let property = this;

    // Slug for property
    let tempSlug = `Property-${property.address.address1}-${property.address.town}-${property.address.county}`;
    property.slug = tempSlug.replace(/[_/-\s]+/g, '-') + '-' + crypto.randomBytes(5).toString('hex');

    /*
    * Re-factored by default_image in schema *
    if( property.image.length === 0) {
        property.image.push({
            path: config.image_path,
            name: config.image_name,
            thumb_path: config.image_path,
            thumb_name: config.image_name,
            original_name: config.image_name
        });
    }
    */
    var err;
    if( property.property_for === 'rent' ){
        // Remove sale prices
        property.sale_price = undefined;
        
        switch (property){
            case _.isEmpty(property.monthly_rent) ||_.isNull(property.monthly_rent):
                err = new Error('Monthly rent is required');
                break;
            case _.isEmpty(property.weekly_rent) ||_.isNull(property.weekly_rent):
                err = new Error('Weekly rent is required');
                break;
            case _.isEmpty(property.deposit_amount) ||_.isNull(property.deposit_amount):
                err = new Error('Deposit Amount is required');
                break;
            case _.isEmpty(property.minimum_tenancy_length) ||_.isNull(property.minimum_tenancy_length):
                err = new Error('Maximum tenant length is required');
                break;
            case _.isEmpty(property.tenancy_agreement_length) ||_.isNull(property.tenancy_agreement_length):
                err = new Error('Maximum no of tenant is required');
                break;
            case _.isEmpty(property.viewing_date) ||_.isNull(property.viewing_date):
                err = new Error('Viewing date is required');
                break;

            default:
                next();    
        }
        
        next(err);
    } else {

        // Remove rent prices
        property.monthly_rent = undefined;
        property.weekly_rent = undefined;
        property.deposit_amount = undefined;
        property.minimum_tenancy_length = undefined;
        property.tenancy_agreement_length = undefined;
        property.viewing_date = undefined;
        if( _.isEmpty(property.sale_price) ||_.isNull(property.sale_price) ){
            err = new Error('Minimum Price is required');
        }       
    }

    next();
});

//  Set the virtual name of property for display purpose
PropertySchema.virtual('virtual_name').get(function () {
    let address1        = !_.isEmpty(this.address.address1) ? `${this.address.address1}, ` : '',
        house_number    = `${this.address.house_number}, `,
        postcode        = `${this.address.postcode}, `,
        town            = `${this.address.town}, `,
        county          = `${this.address.county}`;

    return `${address1}${house_number}${postcode}${town}${county}`;
});
PropertySchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Property', PropertySchema);