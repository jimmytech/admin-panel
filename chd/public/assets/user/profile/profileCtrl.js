'use strict';

angular.module('app.controllers')
.controller('profileCtrl', ['$scope', 'RestSvr', 'dialogService', '$rootScope', 'toastService', 'localStorageService','$location','PostcodeSvr','$timeout',
    function ($scope, RestSvr, dialogService, $rootScope, toastService, localStorageService, $location,PostcodeSvr, $timeout) {

        /* Update user info everytime from localStorage */
        var storage_type = localStorageService.get('staySignedIn','localStorage');
        var userData = localStorageService.get('user', storage_type);
        $rootScope.user = userData;

        /* Update user contact detail */
        $scope.updateDetails = function(isValid) {
            if (!isValid) {
                return;
            }
            RestSvr.put('/update_account/', $scope.user._id, $scope.user).then(function(response) {
                if (response.errors) {
                    /* Handle multiple errors of objects */
                    angular.forEach(response.errors, function(error) {
                        toastService.alert({
                            message: error.message,
                            class: 'error'
                        });
                    });

                } else {
                    // Set the save user data in localstorage
                    localStorageService.set('user', response.data, localStorageService.get('staySignedIn', 'localStorage'));
                    toastService.alert({
                        message: response.message,
                        class: 'success'
                    });
                }
            });
        };

        // Find by registered address
        $scope.findByPostcode = function(postcode){
            if(!postcode){ return; }
            
            PostcodeSvr.lookup(postcode, true).then(function(response){
                $scope.postcodeResults = response.data.result;
                $scope.postcodeinvalid = false;
            }, function(err){
                $scope.postcodeinvalid = true;
                $scope.postcode_response_message = err.data.message;
                $scope.postcodeResults = [];
            });
        };

        if( $scope.user.address ){
            $scope.findByPostcode($scope.user.address.postcode);
        }

        /* Change user password */
        $scope.changePassword = function(isvalid) {
            if (!isvalid) {
                return;
            }    
            if($scope.cuser.new_password !== $scope.cuser.confirm_password){   
                return toastService.alert({
                    message: 'New password and confirm password are not same',
                    class: 'error'
                });
            }
            RestSvr.put('/change_password/', $scope.user._id, $scope.cuser).then(function(response) {
                if (response.errors) {
                    toastService.alert({ message: response.errors.message, class: 'error' });
                } else {
                    // Reset form to its intial stage
                    
                    $scope.userPassChangeForm.$setPristine();
                    $scope.userPassChangeForm.$setUntouched();
                    $timeout(function () {
                        $scope.cuser = {};
                    },1000);
                    toastService.alert({ message: response.message, class: 'success' });
                }
            });
            
        };
        
        /* Change user Email */
        $scope.updateEmail = function(isvalid) {
            if (!isvalid) {
                return;
            }
            
            if($scope.changeEmail.conemail !== $scope.changeEmail.newemail){   
                return toastService.alert({
                    message: 'Email and confirm Email does not match.',
                    class: 'error'
                });
            }
            RestSvr.put('/update_email/', $scope.user._id, $scope.changeEmail).then(function(response) {
                if (response.errors) {
                    toastService.alert({
                        message: response.errors.message,
                        class: 'error'
                    });
                } else {
                    
                    userData.email = $scope.changeEmail.newemail;
                    $scope.user.email = userData.email;
                    localStorageService.set('user', userData, storage_type);
                    
                    $scope.changeEmailForm.$setPristine();
                    $scope.changeEmailForm.$setUntouched();
                    $timeout(function () {
                        $scope.changeEmail = {};
                    },1000);
                    toastService.alert({
                        message: response.message,
                        class: 'success'
                    });
                }
            });
            
        };

        /* Deactivate user */
        $scope.deactivateUserAccount = function(event,isvalid) {
            if (!isvalid) {
                return;
            }    

            dialogService.confirm({ text: 'Are you sure want deactivate your cherrydoor account ?', ok: 'Deactivate' },event)
            .then(function(result) {
                /* user has pressed cancel button */
            }, function(ok){
                RestSvr.put('/deactive_user/', $scope.user._id, $scope.deUser).then(function(response) {
                    if (response.errors) {
                        toastService.alert({
                            message: response.errors.message,
                            class: 'error'
                        });
                    } 
                    if(response.result === true){
                        toastService.alert({
                            message: response.message,
                            class: 'success'
                        });
                        localStorageService.remove('staySignedIn','localStorage');
                        localStorageService.remove('token', storage_type);
                        localStorageService.remove('user', storage_type);
                        delete $rootScope.user;
                        $location.path('/login');
                    }
                });
            });
            
        };
    }
]);