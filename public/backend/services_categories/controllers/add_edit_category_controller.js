'use strict';

app.controller('addEditCategoryController', ['Upload', '$mdDialog', '$routeParams', '$scope', '$location', 'http', 'toastyService',
	function (Upload, $mdDialog, $routeParams, $scope, $location, http, toastyService) {

		(function(){	

			if ($location.path() == "/admin/categories/new-category") {
				$scope.categoryHeader = "New Category";
			} else {
				$scope.categoryHeader = "Edit";
				categoryInfo();				
			}

		}());

		$scope.insertUpdateCategory = function(ev, file){

            Upload.upload({
                url: '/admin/add-update-category',
                data: {
                    file: file,
                    cat: $scope.category
                }
            }).then(function(response) {
            	console.log(response.data);
            toastyService.notification(response.data.success, response.data.msg);
				 if (response.data.success) {
				 	$location.path('/admin/Categories');
				 }
            }); 


			// http.post('/admin/add-update-category', $scope.category).then(function(response){
			// 	 toastyService.notification(response.result.success, response.result.msg);
			// 	 if (response.result.success) {
			// 	 	$location.path('/admin/Categories');
			// 	 }
			// });	

		};

		function categoryInfo() {
			http.get('/admin/category-info/'+$routeParams.id).then(function(response){
				if (response.success) {
					$scope.category = response.result;
					$scope.category.child = "root";
				}else{
					toastyService.notification(response.success, response.msg);
				}
			});
		}	
	
		
}]);