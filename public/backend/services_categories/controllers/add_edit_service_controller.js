'use strict';

app.controller('addEditServiceCtrl', ['$routeParams', "$location", "$scope", "http",  'toastyService', 

	function ($routeParams, $location, $scope, http, toastyService) {

		(function(){
			if ($routeParams.id) {
				$scope.serviceHeader = "Edit Service";
				http.get('/admin/service-info/'+$routeParams.id).then(function(response){
					if (response.success) {
						$scope.service = response.result;
					}else{
						toastyService.notification(response.success, response.msg);
					}
				});
			}else{
				$scope.serviceHeader = "New Service";
			}

		}());


	
	$scope.insertUpdateService = function(){
		http.post('/admin/insert-update-service',$scope.service).then(function(response){
			 toastyService.notification(response.result.success, response.result.msg);
			 if (response.result.success) {
			 	$location.path('/admin/service');
			 }
		});
	};

}]);