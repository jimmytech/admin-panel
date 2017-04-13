'use strict';
	
app.controller('cmsCtrl', ['localData', '$scope', '$location', '$mdDialog',
	function(localData, $scope, $location, $mdDialog) {

		$scope.toggleAdvanceSearch = function  () {

			 $(".listing-srchTop").css("display", "none");
			 $(".advancesrchBx").css("display", "block");
			 
		};
		$scope.hideAdvanceSearch = function  () {

			 $(".advancesrchBx").css("display", "none");
			 $(".listing-srchTop").css("display", "block");
			 
		};

		$scope.cancelRequestPopup = function  (ev) {
			console.log("CANCEL POP");
		    $mdDialog.show({
		      controller: "loginSignupCtrl",
		      templateUrl: 'frontend/popup/cancel_request.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true
		    })
		    .then(function(answer) {
		      // $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      // $scope.status = 'You cancelled the dialog.';
		    });
		};
		$scope.addBookingPopup = function  (ev) {
			console.log("ADD BOOKING");
		    $mdDialog.show({
		      controller: "loginSignupCtrl",
		      templateUrl: 'frontend/popup/add_booking.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true
		    })
		    .then(function(answer) {
		      // $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      // $scope.status = 'You cancelled the dialog.';
		    });
		};
}]);