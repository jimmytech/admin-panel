'use strict';

module.exports =  (io) => {

	io.on('connection', (socket) => {

		/* socket server connected successfully */

	  	console.log('Hurrah! Socket has been connected.............');



	  	/*	detect if socket server disconnected */

	  	socket.on('disconnect', () => {
	  		console.log("Oops! socket disconnected........");
	  	});

	  	socket.on('fist-test-socket', (data) => {

	  		// console.log("data");

		    io.emit('notification', {
		      message: 'new customer',
		      customer: "customer"
		    });

	  	});

	});

};