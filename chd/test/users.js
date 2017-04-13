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
	role: 'landlord',
	password: '123456'
};

let emailSalt = null, token = null, id = null;

/* Test will successfully register a new user to database */
describe('POST /register', function(){
	before(function(done) {
		User.remove({role: { $ne: "admin" }}, function(err) {
			done();
		});
	});

	it('it should not register user without email, password and role', function(done) {
		let noUser = {
			email: null,
			password: null,
			role: null
		};
		chai.request(server)
			.post('/register')
			.send(noUser)
			.end((err, res) => {
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('User validation failed');
                res.body.errors.should.have.property('name').eql('ValidationError');
                done();
			});
	});
	it('it should Register a user', function(done){
		
		chai.request(server)
			.post('/register')
			.send(user)
			.end(function(err, res){
				/* setup salt for email verification */
				emailSalt = res.body.data.record.salt;

				res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('message').eql('User registered successfully and verification link is send to registered email address');
                res.body.data.record.should.be.a('object');
                res.body.data.record.should.have.property('salt');
                res.body.data.should.have.property('success').eql(true);
                done();
			});
	});
});

/* Test will verify user email for successfull login */
describe('GET /verifyEmail', function(){

	it('it should successfully verify email', function(done){
		chai.request(server)
			.get(`/verifyEmail/${emailSalt}`)
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
	});

	it('it should show email salt has been expired', function(done){
		chai.request(server)
			.get(`/verifyEmail/${emailSalt}`)
			.end(function(err, res){
				res.should.have.status(400);
				done();
			});
	});
});

/* Test will login user */
describe('POST /login', function(){
	it('it should not allow login without email and password', function(done){
		chai.request(server)
			.post('/login')
			.send({})
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('Email and password are required');
                res.body.errors.should.have.property('name').eql('Authentication failed');
                res.body.errors.should.have.property('success').eql(false);
				done();
			});
	});

	it('it should not allow login with wrong email', function(done){
		chai.request(server)
			.post('/login')
			.send({email: 'wrong@xyz.com', password: 12346})
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('Authentication failed. User not found.');
                res.body.errors.should.have.property('name').eql('Authentication failed');
                res.body.errors.should.have.property('success').eql(false);
				done();
			});
	});

	it('it should not allow login with wrong password', function(done){
		chai.request(server)
			.post('/login')
			.send({email: user.email, password: 'wrong password'})
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('Authentication failed. Wrong password.');
                res.body.errors.should.have.property('name').eql('Authentication failed');
                res.body.errors.should.have.property('success').eql(false);
				done();
			});
	});

	it('it should not allow login with un-verified email address', function(done){
		let email = 'un-verified@gmail.com',
		testUser = new User({ email: email, firstname: user.firstname, lastname: user.lastname, password: user.password, role: user.role });
		testUser.save(function(err, result) {
			if(err) { console.log(err); }
			else {
				chai.request(server)
				.post('/login')
				.send({email: email, password: user.password})
				.end(function(err, res){
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
	                res.body.errors.should.have.property('message').eql('Your email is not verified, kindly verify your email.');
	                res.body.errors.should.have.property('name').eql('Authentication failed');
	                res.body.errors.should.have.property('success').eql(false);
					done();
				});		
			}
		});
	});

	it('it should not allow login, if user account is deactivate.', function(done){
		let email = 'deactivate@gmail.com',
		testUser = new User({ email: email, password: user.password, firstname: user.firstname, lastname: user.lastname,role: user.role, email_verified: true, status: true, deactivate: true });
		testUser.save(function(err, result) {
			if(err) { console.log(err); }
			else {
				chai.request(server)
				.post('/login')
				.send({email: email, password: user.password})
				.end(function(err, res){
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
	                res.body.errors.should.have.property('message').eql('Your account is deactivate.');
	                res.body.errors.should.have.property('name').eql('Authentication failed');
	                res.body.errors.should.have.property('success').eql(false);
					done();
				});		
			}
		});
	});

	it('it should not allow login, if user account is deactivated by admin.', function(done){
		let email = 'admin-deactivate@gmail.com',
		testUser = new User({ email: email, password: user.password, firstname: user.firstname, lastname: user.lastname,role: user.role, email_verified: true, status: false, deactivate: false });
		testUser.save(function(err, result) {
			if(err) { console.log(err); }
			else {
				chai.request(server)
				.post('/login')
				.send({email: email, password: user.password})
				.end(function(err, res){
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
	                res.body.errors.should.have.property('message').eql('Your account is deactivated by admin, please contact admin.');
	                res.body.errors.should.have.property('name').eql('Authentication failed');
	                res.body.errors.should.have.property('success').eql(false);
					done();
				});		
			}
		});
	});
		
	it('it should login user', function(done){
		chai.request(server)
			.post('/login')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property('message').eql('login success');
                res.body.data.should.have.property('user');
                res.body.data.should.have.property('token');
                res.body.data.should.have.property('success').eql(true);

				token = res.body.data.token;
			    id = res.body.data.user._id;

				done();
			});
	});
});

/* This test will check user forgot password */
describe('POST /forgot', function(){

	it('it should failed without email', function(done){
		chai.request(server)
			.post('/forgot')
			.send({})
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('Email field is required');
                res.body.errors.should.have.property('success').eql(false);
				done();
			});
	});

	it('it should failed with wrong email', function(done){
		chai.request(server)
			.post('/forgot')
			.send({email: 'wrong@xyz.com'})
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('No account with that email has been found');
                res.body.errors.should.have.property('success').eql(false);
				done();
			});
	});

	it('it should provide reset password token link', function(done){
		chai.request(server)
			.post('/forgot')
			.send({email: user.email})
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.data.should.have.property('message').eql('An email has been sent to the provided email with further instructions.');
				res.body.data.should.have.property('success').eql(true);
				done();
			});
	});
});

/* This test will validate reset password token */
describe('GET /reset/:token', function(){
	it('it should failed with invalid/wrong/expired token', function(done){
		chai.request(server)
			.get('/reset/wrongtokenvalue')
			.end(function(err, res){
				res.should.have.status(400);
				done();
			});
	});

	it('it should validate reset token successfully', function(done){
		User.findOne({email: user.email}, {reset_password: 1}, function(err, user){
			
			let resetPasswordToken = user.reset_password.token;
			chai.request(server)
			.get(`/reset/${resetPasswordToken}`)
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
		});
	});
});

/* This test will successfully reset user passsword */
describe('PUT /reset/:token', function(){
	it('it should failed with invalid and expired token', function(done){
		chai.request(server)
			.put('/reset/wrongtokenvalue')
			.send({password: 123465})
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql('Password reset token is invalid or has been expired.');
                res.body.errors.should.have.property('success').eql(false);
				done();
			});
	});

	it('it should successfully reset user password', function(done){
		User.findOne({email: user.email}, {reset_password: 1}, function(err, user){
			
			let resetPasswordToken = user.reset_password.token;
			chai.request(server)
			.put(`/reset/${resetPasswordToken}`)
			.send({password: '1234567'})
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.data.should.have.property('message').eql('Password has been changed successfully.');
                res.body.data.should.have.property('success').eql(true);
				done();
			});
		});
	});
});

/* This test will get user profile by id */
describe('GET /profile/:id', function(){

	it('it should failed with wrong user id', function(done){
		chai.request(server)
		.get('/profile/wronguserid')
		.set('Authorization', 'Bearer '+ token)
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('message').eql('No user found.');
			res.body.errors.should.have.property('success').eql(false);
			done();
		});
	});

	it('it should reterive the user data successfully', function(done){
		chai.request(server)
		.get(`/profile/${id}`)
		.set('Authorization', 'Bearer '+ token)
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('data');
			res.body.data.should.have.property('record');
			res.body.data.should.have.property('success').eql(true);
			done();
		});
	});	
});

/* This test will generate or refersh token by user email */
describe('POST /refresh_token', function(){

	it('it should failed if user emaii is null or empty', function(done){
		chai.request(server)
		.post('/refresh_token')
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('message').eql('Email is required.');
			res.body.errors.should.have.property('success').eql(false);
			done();
		});
	});

	it('it should failed if user emaii not exists', function(done){
		chai.request(server)
		.post('/refresh_token')
		.send({ email: 'wrongemail' })
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('message').eql('User email did not match.');
			res.body.errors.should.have.property('success').eql(false);
			done();
		});
	});

	it('it should successfully generate token', function(done){
		chai.request(server)
		.post('/refresh_token')
		.send({ email: 'wrongemail' })
		.end(function(err, res){
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('message').eql('User email did not match.');
			res.body.errors.should.have.property('success').eql(false);
			done();
		});
	});
});