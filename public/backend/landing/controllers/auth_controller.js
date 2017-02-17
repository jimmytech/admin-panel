'use strict';

app.controller('authController', ['$scope', '$location', '$rootScope', '$http', function($scope, $location, $rootScope, $http){
		$scope.adminLogin = function(){		
		 $http.post('/admin/login', $scope.loginInfo).then(function(response){	 	
		 	if(response.data.success===true){
		 	    localStorage.setItem('token', response.data.token);		 		
		 		$location.path('/admin/dashboard');
		 	}else{
		 		// alert(response.data.message);
		 	}
		 });
	  };	  
}]);