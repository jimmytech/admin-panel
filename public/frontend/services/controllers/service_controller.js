'use strict';

app.controller("serviceCtrl", ["$scope", "http", "$location", 'toastyService', '$cookies',
	function ($scope, http, $location, toastyService, $cookies) {

		(function(){
			
			http.get('/category-service-list').then(function(response){				
				$scope.dataArray = response.record.result;
			});

		})();

	

		var categoryArray = [];
		$scope.selectCategory = function(category, i){
			
			manageClassOnCategory(i);
			var index = categoryArray.indexOf(category);

			if (index === -1) {

				categoryArray.push(category);

			}else{

				categoryArray.splice(index, 1);

			}

		};

		function manageClassOnCategory(index) {

			var className = '.temp-class'+index;		
			
			if ($(className).hasClass('selected-category')) {

				$(className).removeClass('selected-category');

			}else{

				$(className).addClass('selected-category');			

			}
			
		}

		$scope.addCategory = function(){

			$cookies.put('categoryArray', categoryArray);

			if (categoryArray.length>0) {

				var url = categoryArray[0].toLowerCase();
				var index = url.indexOf(' ');

				if (index > 0) {
					url = url.substr(0, index);
				}

				$location.path("/add-services/service-info/complete/");

			}else{
				 toastyService.notification(false, "Please select category");
			}
		};
		
		
	}]);