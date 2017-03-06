'use strict';

app.controller('userController', ['$scope', '$location', 'socket',
	function ($scope, $location, socket) {	


	// var socketObj = {'a': 1, 'b':2};
	// socket.emit('fist-test-socket', socketObj);
             
	(function(){

		var locationArray = $location.path().split('/');
		var lastIndex = locationArray[locationArray.length-1];

		if (lastIndex == 'service-providers') {

			$scope.userType = "Service Provider";

		} else if (lastIndex == 'customers') {

			$scope.userType = "Customer";
			
		}

		$scope.data  = [
		{"firstname": "Jhon", "email": "jhon@gmail.com", "status": true}, 
		{"firstname": "Rohan", "email": "Rohan@gmail.com", "status": false},
		{"firstname": "Bill", "email": "Bill@gmail.com", "status": false},
		{"firstname": "Milton", "email": "Milton@gmail.com", "status": true},
		{"firstname": "Juri", "email": "Juri@gmail.com", "status": true},
		{"firstname": "Jack", "email": "Jack@gmail.com", "status": true},
		{"firstname": "Jitendra", "email": "Jitendra@gmail.com", "status": true},
		{"firstname": "Node", "email": "Node@gmail.com", "status": true},
		{"firstname": "Amit", "email": "Amit@gmail.com", "status": false},
		{"firstname": "Sumit", "email": "Sumit@gmail.com", "status": false},
		];

	})();


	$scope.addNew = function(url){
		$location.path(url);
	};

	$scope.signUp = function(){
		console.log($scope.user);
	};

	$scope.back = function(){
		window.history.back();
	};

}]);