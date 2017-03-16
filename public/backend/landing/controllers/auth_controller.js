'use strict';

app.controller('authController', ['toastyService', '$scope', '$location', '$rootScope', '$http',
 function(toastyService, $scope, $location, $rootScope, $http){
		$scope.adminLogin = function(){		
		 $http.post('/admin/login', $scope.loginInfo).then(function(response){	 	
		 	if(response.data.success===true){
		 	    localStorage.setItem('token', response.data.token);		 		
		 		$location.path('/admin/dashboard');
		 	}else{
		 		toastyService.notification(false, response.data.message);
		 	}
		 });
	  };	  
}]);