'use strict';

app.controller('addEditCategoryController', ['$mdDialog', '$routeParams', '$scope', '$location', 'http', 'toastyService',
	function ($mdDialog, $routeParams, $scope, $location, http, toastyService) {

		(function(){	
			setHeaderName();
			dropDownList();
		}());

		function setHeaderName() {

			if ($location.path() == "/admin/categories/new-category") {
				$scope.categoryHeader = "New Category";
			} else {
				$scope.categoryHeader = "Edit";
				categoryInfo();				
			}			
		}

		$scope.insertUpdateCategory = function(ev){
			if (angular.isDefined($scope.category.sub_category)) {
				var subCategory = angular.copy($scope.category.sub_category);
					if (subCategory.length>0) {
						var confirm = $mdDialog.confirm()
				          .title('Are you sure?')
				          .textContent('This category supposed to be a root category. All the child categories will also become subcategory of ABC. This operation can not be UNDO')
				          .ariaLabel('Lucky day')
				          .targetEvent(ev)
				          .ok('Ok')
				          .cancel('Cancel');	
				          
					    $mdDialog.show(confirm).then(function() {
					      	insertUpdateCat();
					    }, function() {
					    });				          					
					}else{
						insertUpdateCat();
					}
			}else{
				insertUpdateCat();
			}

		};

		function insertUpdateCat() {
			http.post('/admin/add-update-category', $scope.category).then(function(response){
				 toastyService.notification(response.result.success, response.result.msg);
				 if (response.result.success) {
				 	$location.path('/admin/Categories');
				 }
			});			
		}

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

		function dropDownList() {
			http.get('/admin/category-drop-down-list').then(function(response){
				$scope.dropDownList = response.result;
				for(var i=0; i<$scope.dropDownList.length;i++){
					if ($scope.dropDownList[i]._id == $scope.category._id) {
						$scope.dropDownList.splice(i, 1);
					}
				}
			});
		}	
		
}]);