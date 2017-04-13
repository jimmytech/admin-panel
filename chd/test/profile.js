'use strict';
process.env.NODE_ENV = 'test';

let path 		= require('path'),
	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	User 		= require(path.resolve('./models/User')),
	chai 		= require('chai'),
	chaiHttp 	= require('chai-http'),
	server 		= require(path.resolve('./server')),
	should 		= chai.should();

chai.use(chaiHttp);

// user credientials
let user = {
	email: 'yash_sharma@seologistics.com',
	firstname: 'Yash',
	lastname: 'Sharma',
	password: '1234567'
},
token = null, id = null;

describe('POST /login', function(){
	it('it should login user for profile test', function(done){
		User.remove({role: { $ne: "admin" }}, function(err) {
			let newUser = new User({firstname: user.firstname, lastname: user.lastname,email: user.email, password: user.password, role: 'landlord', status: true, email_verified: true}); // we are manually verifying user email
			newUser.save(function(err, success){
				if(success){
					chai.request(server)
					.post('/login')
					.send(user)
					.end(function(err, res){
						res.should.have.status(200);
						token = res.body.data.token;
						id = res.body.data.user._id;
						done();
					});
				}
			});
		});
		
	});
});

/* Test will successfully update user details to database */
describe('PUT /update_account/:id', function(){

	it('it should not update user without authorization token', function(done){
		chai.request(server)
		.put(`/update_account/${id}`)
		.send({})
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('name').eql('UnauthorizedError');
			res.body.should.have.property('message').eql('No authorization token was found');
			done();
		});
	});

	it('it should not update user with empty body', function(done){
		chai.request(server)
		.put(`/update_account/${id}`)
		.send({})
		.set('Authorization', 'Bearer '+ token)
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('message').eql('User details cannot be updated');
			res.body.errors.should.have.property('success').eql(false);
			done();
		});
	});

	it('it should throw errors if validation failed', function(done){
		chai.request(server)
		.put(`/update_account/${id}`)
		.send({
			firstname: 'my name is 20 characters long and system should through error while updating.', 
			phone: {
				telephone: 123456789011
			},
			address: {
				postcode: 1234567890
			}
		})
		.set('Authorization', 'Bearer '+ token)
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('message').eql('Validation failed');
			res.body.should.have.property('name').eql('ValidationError');
			res.body.should.have.property('errors');
			done();
		});
	});

	it('it should successfully update user contact details', function(done){
		chai.request(server)
		.put(`/update_account/${id}`)
		.set('Authorization', 'Bearer '+ token)
		.send({firstname: 'Yash', lastname: 'Sharma', email: user.eamil, address:{postcode: 1234678}})
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('data');
			res.body.data.should.have.property('message').eql('Contact details has updated successfully');
			res.body.data.should.have.property('success').eql(true);
			done();
		});
	});
});

/*Test will successfully change password*/

describe('PUT /change_password/:id', function() {
    it('it should not allow to change password without new password and confirm password', function(done) {
        chai.request(server)
            .put(`/change_password/${id}`)
            .set('Authorization', 'Bearer '+ token)
            .send({})
            .end(function(err, res) {
            	res.should.have.status(200);
                res.body.should.be.a('object');
				res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('New password and confirm password are required');
                res.body.errors.should.have.property('name').eql('Authentication failed');
                res.body.errors.should.have.property('success').eql(false);
                done();
            });

    });

    it('it should not allow to change password if new password and confirm password is not equal', function(done) {
        chai.request(server)
            .put(`/change_password/${id}`)
            .set('Authorization', 'Bearer '+ token)
            .send({new_password: "123456", confirm_password: "123"})
            .end(function(err, res) {
            	res.should.have.status(200);
                res.body.should.be.a('object');
				res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('New password and confirm password are not same');
                res.body.errors.should.have.property('name').eql('Authentication failed');
                res.body.errors.should.have.property('success').eql(false);
                done();
            });

    });

	it('it should not allow to change password if _id or old password mismatch', function(done){
		chai.request(server)
			.put(`/change_password/${id}`)
			.set('Authorization', 'Bearer '+ token)
			.send({new_password: '123456', confirm_password: '123456', current_password: "wrongpassword"})
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('Current password did not match.');
                res.body.errors.should.have.property('success').eql(false);
				done();
			});
	});


    it('it should allow to change password successfully', function(done) {
        let obj = {
        	new_password: "$123&456",
            confirm_password: "$123&456",
            current_password:  user.password
        };
        user.password = obj.new_password;
        chai.request(server)
            .put(`/change_password/${id}`)
            .set('Authorization', 'Bearer '+ token)
            .send(obj)
            .end(function(err, res) {
            	res.should.have.status(200);
                res.body.should.be.a('object');
				res.body.should.have.property('data');
                res.body.data.should.have.property('message').eql('Your password has been changed');
                res.body.data.should.have.property('success').eql(true);
                done();
            });
    });
});

describe('PUT /update_email/:id', function() {
	it('it should not allow to change email if authentication failed', function(done){
		chai.request(server)
			.put(`/update_email/${id}`)
			.set('Authorization', 'Bearer '+ token)
			.send({password: "ifwrongpassword", newemail: "set_new_email@gmail.com"})
            .end(function(err, res) {
            	res.should.have.status(200);
                res.body.should.be.a('object');
				res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('You entered wrong Password.');
                res.body.errors.should.have.property('success').eql(false);
                done();
            });			
	});

	it('it should allow to change email successfully', function(done){
		chai.request(server)
			.put(`/update_email/${id}`)
			.set('Authorization', 'Bearer '+ token)
			.send({password: user.password, newemail: "set_new_email@gmail.com"})
            .end(function(err, res) {
            	res.should.have.status(200);
                res.body.should.be.a('object');
				res.body.should.have.property('data');
                res.body.data.should.have.property('message').eql('Your email has been changed');
                res.body.data.should.have.property('success').eql(true);
                done();
            });			
	});		
});
describe('PUT /deactive_user/:id', function() {
	it('it should not allow to deactive account if authentication failed', function(done){
		chai.request(server)
			.put(`/deactive_user/${id}`)
			.set('Authorization', 'Bearer '+ token)
			.send({password: "user.password"})
            .end(function(err, res) {
            	res.should.have.status(200);
                res.body.should.be.a('object');
				res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('You entered wrong Password.');
                res.body.errors.should.have.property('name').eql('Authentication failed');
                res.body.errors.should.have.property('success').eql(false);
                done();
            });			
	});

	it('it should allow to deactive account successfully', function(done){
		chai.request(server)
			.put(`/deactive_user/${id}`)
			.set('Authorization', 'Bearer '+ token)
			.send({password: user.password})
            .end(function(err, res) {
            	res.should.have.status(200);
                res.body.should.be.a('object');
				res.body.should.have.property('data');
                res.body.data.should.have.property('message').eql('Your account has been deactivated');
                res.body.data.should.have.property('success').eql(true);
                done();
            });			
	});		
});