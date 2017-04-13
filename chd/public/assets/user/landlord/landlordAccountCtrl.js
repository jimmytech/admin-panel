'use strict';

angular.module('app.controllers')
.controller('landlordAccountCtrl', ['$scope', '$location', 'PostcodeSvr','localStorageService','RestSvr','$rootScope','toastService','$timeout',
	function($scope, $location, PostcodeSvr, localStorageService, RestSvr, $rootScope, toastService, $timeout){
		
		$scope.landlord = {};
		/* Update user info everytime from localStorage */
        var storage_type = localStorageService.get('staySignedIn','localStorage');
        var userData = localStorageService.get('user', storage_type);

		// Landlord Account Detail
		$scope.landlordDetails = function (isValid) {
			if(!isValid){
				return;
			}
			if($scope.landlord.personalDetail.correspondence_as_home){
				$scope.landlord.personalDetail.correspondence_address = angular.copy($scope.landlord.personalDetail.address);
			}
			RestSvr.put('/update_account/', $scope.user._id, $scope.landlord.personalDetail).then(function(response) {
				if(response.errors){
					toastService.alert({message: response.errors.message, class: 'error'});
				} else {
					localStorageService.set('user', response.data, storage_type);
					toastService.alert({message: response.message, class: 'success'});
				}
			});
		};

		// Find by registered address
		$scope.findByPostcode = function(postcode, clear){
			if(!postcode){ return; }
			// Clear all the fields
			if(clear){
				$scope.landlord.personalDetail.address.address1 = null;
				$scope.landlord.personalDetail.address.address2 = null;
				$scope.landlord.personalDetail.address.county = null;
				$scope.landlord.personalDetail.address.town = null;
				$scope.landlord.personalDetail.address.country = null;	
			}
			
			PostcodeSvr.lookup(postcode, true).then(function(response){
				$scope.postcodeResults = response.data.result;
				$scope.postcodeinvalid = false;
			}, function(err){
				$scope.postcodeinvalid = true;
				$scope.postcode_response_message = err.data.message;
				$scope.postcodeResults = [];
			});
		};

		// find by correspoindance postcode
		$scope.findByCorrespondencePostcode = function(postcode, clear){
			if(!postcode){ return; }
			// Clear all the fields
			if(clear){
				$scope.landlord.personalDetail.correspondence_address.address1 = null;
				$scope.landlord.personalDetail.correspondence_address.address2 = null;
				$scope.landlord.personalDetail.correspondence_address.county = null;
				$scope.landlord.personalDetail.correspondence_address.town = null;
				$scope.landlord.personalDetail.correspondence_address.country = null;
			}	
			PostcodeSvr.lookup(postcode, true).then(function(response){
				$scope.cpostcodeResults = response.data.result;
				$scope.cpostcodeinvalid = false;
			}, function(err){
				$scope.cpostcodeinvalid = true;
				$scope.cpostcode_response_message = err.data.message;
				$scope.cpostcodeResults = [];
			});
		};
		if( userData ) {
        	$scope.landlord.personalDetail = userData;	
        	$rootScope.user = userData;
        	if( $scope.landlord.personalDetail.address ){$scope.findByPostcode($scope.landlord.personalDetail.address.postcode, false); }
        	if( $scope.landlord.personalDetail.correspondence_address ){$scope.findByCorrespondencePostcode($scope.landlord.personalDetail.correspondence_address.postcode, false); }
        }

        /* Change user password */
        $scope.changePassword = function(isvalid) {
            if (!isvalid) {
                return;
            }
            
            if($scope.landlord.changePassword.new_password !== $scope.landlord.changePassword.confirm_password){   
                return toastService.alert({message: 'New password and confirm password are not same', class: 'error'});
            }
            RestSvr.put('/change_password/', $scope.user._id, $scope.landlord.changePassword).then(function(response) {
                if (response.errors) {
                    toastService.alert({ message: response.errors.message, class: 'error' });
                } else {
                    // Reset form to its intial stage
                    $scope.landlordChangePasswordForm.$setPristine();
                    $scope.landlordChangePasswordForm.$setUntouched();
                    $timeout(function () {
                    	$scope.landlord.changePassword = {};	
                    },1000);
                    toastService.alert({ message: response.message, class: 'success' });
                }
            });
            
        };
	}
]);