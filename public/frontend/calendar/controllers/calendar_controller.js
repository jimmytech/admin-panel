'use strict';

app.controller("calendarCtrl", ["$scope", 
	function ($scope) {

		

		(function(){

			  $scope.myDate = new Date();

			  $scope.minDate = new Date(
			    $scope.myDate.getFullYear(),
			    $scope.myDate.getMonth(),
			    $scope.myDate.getDate()
			  );

			  $scope.calendar = {
			  	start_date: new Date($scope.minDate),
			  	end_date: new Date($scope.minDate)
			  };

			  time();
		}());

	function time() {
		$scope.mm = [];
		$scope.hh = [];

		for (var i = 1; i <= 60; i++) {
				$scope.mm.push(i);
				if (i<=12) {
					$scope.hh.push(i);
				}
		}
	}	

	$scope.setAvailabity = function(){
		console.log($scope.calendar);
	};

	}]);