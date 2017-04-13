'use strict';

angular.module('app.directives')
.directive('landlordSidebar', ['$location', function($location) {
	return {
		restrict: 'A',
		scope: {
			userAccountMenu: '='
		},
		templateUrl: 'assets/user/landlord/directives/templates/landlord-sidebar.html',
		link: function(scope){
			
			/*var userAccountMenu = [{
				url: '/my-details',
				text: 'Update contact details'
			},{
				url: '/change-my-password', 
				text: 'Change my password'
			}, {
				url: '/change-my-email',
				text: 'Change your email'
			}, {
				url: '/deactivate-my-account',
				text: 'Deactivate Account'
			}, {
				url: '/verify-details',
				text: 'Verify Details'
			}, {
				url: '/',
				text: 'Messaging'
			}];

			scope.menu = userAccountMenu;
			scope.path = $location.path();*/
			scope.path = $location.path();
			scope.oneAtATime = true;	 
			scope.status = {
				isCustomHeaderOpen: false,
				isFirstOpen: true,
				isFirstDisabled: false
			};

		},
		controller: ['$scope', '$mdDialog', 'RestSvr','$rootScope', 'localStorageService', 'Upload','$timeout', 'toastService',
			function ($scope, $mdDialog, RestSvr,$rootScope, localStorageService,Upload, $timeout, toastService) {

				var storage_type = localStorageService.get('staySignedIn','localStorage');
        		var userData = localStorageService.get('user', storage_type);
        		if( userData ) {
        			$rootScope.user = userData;
        		}
				var self = this;
				$scope.myImage='';
				$scope.myCroppedImage='';
				var allowed_image_extensions = ['image/jpeg','image/jpg','image/png'];
				$scope.selectFile = function (file, show) {
					if(file && allowed_image_extensions.indexOf(file.type) === -1){
						toastService.alert({message: 'You can only upload image having file extension jpg, jpeg or png', class: 'error'});	
						return;
					}
					self.filename = (file)? file.name : '';
					var reader = new FileReader();
					reader.onload = function (evt) {
						$scope.$apply(function($scope){
							$scope.myImage=evt.target.result;
							if(show){
								$scope.showPrerenderedDialog();	
							}

						});
					};
					reader.readAsDataURL(file);
				};
				$scope.closeImageDialog = function () {
					$scope.myImage='';
					$mdDialog.hide();
				};

				$scope.showPrerenderedDialog = function() {
					$mdDialog.show({
						contentElement: '#imageDialog',
						parent: angular.element(document.body),
						clickOutsideToClose: true
					});
				};
				$scope.spinner = false;
				$scope.uploadProfileImage = function (croppedDataUrl, image) {
					$scope.spinner = true;
	          		var profile_image = {
	          			dataUrl: croppedDataUrl,
	          			image_name: self.filename
	          		};
	          		
	          		Upload.upload({
          		        url: '/update_account/' + $rootScope.user._id,
          		        method: 'PUT',
          		        headers: { "Authorization": "Bearer " + localStorageService.get('token', storage_type) },
          		        data: {
          		        	profile_image: Upload.dataUrltoBlob(profile_image.dataUrl, profile_image.image_name)
          		        }
          		    }).then(function (response) {
          		        $timeout(function () {
          		        	onSuccessItem(response.data);
          		        });
          		    }, function (response) {
          		        if (response.status > 0) onErrorItem(response.data);
          		    }, function (evt) {
          		        $scope.determinateValue = parseInt(100.0 * evt.loaded / evt.total, 10);
          		    });
          		
	          	};

	          	// Called after the user has successfully uploaded a new picture
          	    function onSuccessItem(response) {
          	    	$scope.spinner = false;
          	    	localStorageService.set('user', response.data.record, storage_type);
          	    	if(!angular.isUndefined( response.data.record.profile_image )){  $rootScope.user.profile_image = response.data.record.profile_image; }
					toastService.alert({message: 'Profile Image Updated Successfully', class: 'success'});	
          	    	$mdDialog.hide();
          	    }

          	    // Called after the user has failed to uploaded a new picture
          	    function onErrorItem(response) {
          	    	$scope.spinner = false;
          	    	toastService.alert({message: response.message, class: 'error'});	
          	    }
	        }]
	    };
	}
]);