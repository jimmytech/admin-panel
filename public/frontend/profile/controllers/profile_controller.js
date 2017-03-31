'use strict';


app.controller('profileCtrl', ['toastyService', 'localData', '$scope', '$location', '$rootScope', 'http', '$mdDialog',
	function(toastyService, localData, $scope, $location, $rootScope, http, $mdDialog) {

		(function(){

			$scope.user = localData.data();
			$scope.user.dob = new Date($scope.user.dob);
			$scope.dobMaxDate = new Date();

		}());
	
	
  	$scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };		

  $scope.leaveReviewPopup = function  (ev) {
		    $mdDialog.show({
		      controller: "includesCtrl",
		      templateUrl: 'frontend/popup/leave_review.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
  };

  $scope.updateProfile = function(){

  	var data = angular.copy($scope.user);
  	var removalData = ['country_code', 'updated_at', "created_at"]; 

  	removalData.forEach(function(key){
  		delete data[key];
  	});

  	http.post('/update-profile', data).then(function(response){

  		toastyService.notification(response.result, response.message);
  		if (response.result) {
  			localData.setUser($scope.user);
  		}
  	});
  };



}]);

