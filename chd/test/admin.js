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

// Admin user credientials
let adminUser = {
	email: 'admin@cherrydoortest.com',
	role: 'superAdmin',
	password: '123456',
	status: true
};

/* Test Register a new admin */
/*describe('/POST /admin/register', function(){

	before(function(done){
		User.remove({role: { $eq: "admin" }}, function(err){
			done();
		});
	});

	it('it should not Register a admin without email, password and login', function(done){
		let admin = {
			email: null,
			password: null,
			role: null
		};
		chai.request(server)
			.post('/admin/register')
			.send(admin)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('message').eql('Email, password and role are required');
                res.body.error.should.have.property('name').eql('Registration failed');
                res.body.error.should.have.property('success').eql(false);
                done();
			});
	});
	it('it should Register a admin user', function(done){
		
		chai.request(server)
			.post('/admin/register')
			.send(adminUser)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Admin registered successfully');
                res.body.user.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                done();
			});
	});
	it('it should not register a admin with same email', function(done){
		
		chai.request(server)
			.post('/admin/register')
			.send(adminUser)
			.end(function(err, res){
				res.should.have.status(500);
                done();
			});
	});
});*/

/*describe('/POST /admin/login', function(){
	it('it should not login admin with wrong email and password', function(done){
		let wrongAdmin = {
			email: 'admin@gibrrash.com',
			password: 'i dont know'
		};
		chai.request(server)
			.post('/admin/login')
			.send(wrongAdmin)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('name').eql('Authentication failed');
                res.body.error.should.have.property('message').eql('Authentication failed. User not found.');
                res.body.error.should.have.property('success').eql(false);
                done();
			});
	});

	it('it should login a admin user', function(done){
		
		chai.request(server)
			.post('/admin/login')
			.send(adminUser)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('user');
                res.body.should.have.property('token');
                done();
			});
	});
});*/

/**
* Forgot for reset password (forgot POST)
*/
/*describe('/POST /admin/forgot', function(){

	it('it should not reset admin password with no email', function(done){
		let noAdminEmail = {};
		chai.request(server)
			.post('/admin/forgot')
			.send(noAdminEmail)
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('message').eql('Email field is required');
                res.body.error.should.have.property('success').eql(false);
                done();
			});
	});

	it('it should not reset admin password using invalid email', function(done){
		let wrongAdminEmail = {
			email: 'admin@gibrrash.com',
		};
		chai.request(server)
			.post('/admin/forgot')
			.send(wrongAdminEmail)
			.end(function(err, res){
				res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('message').eql('No account with that email has been found');
                res.body.error.should.have.property('success').eql(false);
                done();
			});
	});

	it('it should reset admin password with valid email', function(done){
		chai.request(server)
			.post('/admin/forgot')
			.send({email: adminUser.email})
			.end(function(err, res){
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('An email has been sent to the provided email with further instructions.');
                res.body.should.have.property('success').eql(true);
                done();
			});
	});
});*/