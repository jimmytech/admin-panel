'use strict';

app.controller('submitServiceCtrl', ['toastyService', '$location', "$scope", "http", '$cookies',

	function (toastyService, $location, $scope, http, $cookies) {
		
		(function(){

			$scope.exotics = [{"id": 1}];
			$scope.service = {};
			$scope.waitress = {};
			$scope.poker = {};
			
			http.get('/category-service-list').then(function(response){
				
				$scope.dataArray = response.record.result;
				
				$scope.categoryTitle = $scope.dataArray.category.map(function(item){
					return item.title;
				});

			});	
			manageServiceDiv();
		})();

		function manageServiceDiv() {

			
			var cookieData = $cookies.get('categoryArray').split(',');

			$scope.SELECTDIV  = {

				"WAITRESS": cookieData.indexOf('WAITRESS') >= 0,
				"POKER": cookieData.indexOf('POKER DEALING') >= 0,
				"EXOTIC": cookieData.indexOf('EXOTIC DANCING') >= 0

			};

		}
		
		$scope.addNewChoice = function() {

			var newItemNo = $scope.exotics.length+1;
			$scope.exotics.push({'id':newItemNo});

		};

	    
		$scope.removeChoice = function(index) {	
			$scope.exotics.splice(index, 1);
		};	


		$scope.checkWaitressSelection = function(key){

			if ($scope.waitress[key].type === 0) {
				delete $scope.waitress[key];
			}

		};

		$scope.checkPokerSelection = function (key) {

			if ($scope.poker[key].type === 0) {
				delete $scope.poker[key];
			}

		};

		$scope.submitData = function(){
			
			if ($scope.SELECTDIV.WAITRESS) {

				if (angular.equals($scope.waitress, {})) {
					toastyService.notification(false, "Please select waitress service information");
					return;
				}

			} 

			if ($scope.SELECTDIV.POKER) {

				if (angular.equals($scope.poker, {})) {
					toastyService.notification(false, "Please select poker service information");
					return;
				}

			}

			saveCategoryInfo();

		};

		function saveCategoryInfo(){

			var data = [];
			if(!angular.equals($scope.waitress, {})){

				var tempWaitress = {
					waitress: $scope.waitress
				};

				data.push(tempWaitress);
			}

			if (!angular.equals($scope.poker, {})) {

				var tempPoker = {
					poker: $scope.poker
				};

				data.push(tempPoker);
			}

			if ($scope.SELECTDIV.EXOTIC) {

				var tempExotics = {
					exotics: $scope.exotics
				};

				data.push(tempExotics);
			}

			var finalData = {
				travel_distance: $scope.travel_distance,
				category: data
			};

			http.post('/save-category-data', finalData).then(function(response){
				console.log(response);
			});
		}



	}]);