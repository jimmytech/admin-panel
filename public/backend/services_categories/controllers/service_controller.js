'use strict';

app.controller('serviceCtrl', ['toastyService', 'confirmationDialog', "http", "$scope", "$location",  
	function (toastyService, confirmationDialog, http, $scope, $location) {

		(function(){

			http.get('/admin/service-list').then(function(response){
				$scope.data = response;
			});

		}());

		$scope.addNew = function(url){
			$location.path(url);
		};

		$scope.redirectTo = function(url, id) {
			$location.path(url+id);
		};	
		
		$scope.trash = function(id, index, event){
			confirmationDialog.confirm(event, function(result){
                result.then(function(){
                    http.delete('/admin/delete-service/' + id).then(function(response) {
                        toastyService.notification(response.result.success, response.result.msg);
                        if (response.result.success) {
                            $scope.data.result.splice(index, 1);
                        }                
                    });
                }, function(){
                });				
			});
		};			

}]);