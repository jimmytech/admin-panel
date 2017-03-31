'use strict';

app.controller('addEditUserCtrl', ['$timeout', 'toastyService', '$rootScope', 'http', '$scope', '$location', '$routeParams',
	function ($timeout, toastyService, $rootScope, http, $scope, $location, $routeParams) {	

             
	(function(){
			userInfo();

	})();

	function userInfo(){

		if ($routeParams.id) {
			http.get('/admin/user-detail-by-id?id='+$routeParams.id).then(function(response){
				$scope.user = response.result;
			});
		}
	}

	$scope.signUp = function(){		

		http.post('/admin/user-registration', $scope.user).then(function(response){

			toastyService.notification(response.result.success, response.result.message);

			if (response.result.success) {
				$location.path('/admin/users');				
			}
			
		});
	};

	$scope.updateUser = function(){

		http.post('/admin/update-user', $scope.user).then(function(response){
			toastyService.notification(response.result.success, response.result.msg);
			if (response.result.success) {
				$location.path('/admin/users');			
			}
		});

	};



}]);