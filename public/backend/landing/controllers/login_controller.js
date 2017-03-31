'use strict';

app.controller('authController', ['toastyService', '$scope', '$location', '$http',
 function(toastyService, $scope, $location, $http){

		$scope.adminLogin = function(){	
			
		 $http.post('/admin/login', $scope.user).then(function(response){	 	
		 	
		 	toastyService.notification(response.data.success, response.data.message);
		 	
		 	if(response.data.success===true){
		 	    
		 	    localStorage.setItem('token', response.data.token);		 		
		 		$location.path('/admin/dashboard');

		 	}

		 });

	  };	  
}]);