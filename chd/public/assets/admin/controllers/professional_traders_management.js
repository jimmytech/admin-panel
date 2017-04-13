app.controller('professionalTradersCtrl', ['$scope','RestSvr', '$location',
 function ($scope, RestSvr, $location) {
	$scope.serviceRequestList = function(){
		RestSvr.get('/admin/professional-traders-request').then(function(response){
			console.log("response");
		});
	};
	$scope.newAccountPage = function(){
		$location.path('/professional-traders/registration');
	};
    $scope.back = function() {
        window.history.back();
    };	
    $scope.signUp = function(){
    	console.log($scope.user);
    };
}]);