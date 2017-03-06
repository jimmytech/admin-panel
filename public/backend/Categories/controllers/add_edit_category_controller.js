'use strict';

app.controller('addEditCategoryController', ['$routeParams', '$scope', '$location', 'http', 'toastyService',
	function ($routeParams, $scope, $location, http, toastyService) {

		(function(){
			dropDownList();
			if ($location.path() == "/admin/categories/new-category") {
				$scope.categoryHeader = "New Category";
			} else {
				$scope.categoryHeader = "Edit";
				categoryInfo();				
			}
			
		}());

		$scope.insertUpdateCategory = function(){
			http.post('/admin/add-update-category', $scope.category).then(function(response){
				 toastyService.notification(response.result.success, response.result.msg);
				 if (response.result.success) {
				 	$location.path('/admin/Categories');
				 }
			});
		};

		function categoryInfo() {
			http.get('/admin/category-info/'+$routeParams.id).then(function(response){
				if (response.success) {
					$scope.category = response.result;
				}else{
					toastyService.notification(response.success, response.msg);
				}
			});
		}	

		function dropDownList() {
			http.get('/admin/category-drop-down-list').then(function(response){
				$scope.dropDownList = response.result;
			});
		}	
		
}]);