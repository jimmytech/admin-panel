'use strict';

app.controller('categoryController', ['toastyService', 'confirmationDialog', '$scope', '$location', 'http',
	function (toastyService, confirmationDialog, $scope, $location, http) {

		(function(){
			categortList();
		})();
		$scope.determinateValue = 50;
		

		$scope.addNew = function(url){
			$location.path(url);
		};

		function categortList () {
			http.get('/admin/category-list').then(function(response){
				$scope.data = response;
			});	
		}

		$scope.redirectTo = function(url, id) {
			$location.path(url+id);
		};

		$scope.delete = function(id, index, event){
			confirmationDialog.confirm(event, function(result){
                result.then(function(){
                    http.delete('/admin/delete-category/' + id).then(function(response) {
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