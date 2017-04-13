'use strict';

angular.module('app.controllers')
.controller('editPropertiesCtrl', ['$scope', 'RestSvr', 'toastService', 'localStorageService','$location','PropertySvr','PostcodeSvr','$routeParams','dialogService','$timeout',
	function ($scope, RestSvr, toastService, localStorageService, $location, PropertySvr, PostcodeSvr, $routeParams, dialogService, $timeout) {
		
		/*Global dropzone instance*/
		var myDropzone;
		$scope.property = {};
		$scope.property.cart = [];

		/* Set default date as current date for available and viewing date */
		var currentDate = new Date();
		$scope.available_date =  currentDate;
		$scope.viewing_date = currentDate;

		/* Set mindate to prevent past date selection */
		$scope.minDate = new Date(
			$scope.available_date.getFullYear(),
			$scope.available_date.getMonth(),
			$scope.available_date.getDate()
		);

		// Get property additonals
		$scope.getPropertyAdditionals = function(){
			PropertySvr.propertyAdditionals('additionalFeature')
			.then(function (response) {
				$scope.featuresX = response;
			})
			.then(function (response) {
				return PropertySvr.propertyAdditionals('property_type').then(function (response) {
					$scope.property_rental = response;
				});
			})
			.then(function (response) {
				return PropertySvr.propertyAdditionals('heating').then(function (response) {
					$scope.heating = response;
				});
			})
			.then(function (response) {
				return PropertySvr.propertyAdditionals('age').then(function (response) {
					$scope.age = response;
				});
			})
			.then(function (response) {
				return PropertySvr.propertyAdditionals('style').then(function (response) {
					$scope.style = response;
				});
			})
			.then(function (response) {
				return PropertySvr.propertyAdditionals('authority').then(function (response) {
					$scope.authority = response;
				});
			})
			.then(function (response) {
				return PropertySvr.propertyAdditionals('location').then(function (response) {
					$scope.location = response;
				});
			})
			.then(function (response) {
				return PropertySvr.propertyAdditionals('parking').then(function (response) {
					$scope.parkingOptions = response;
				});
			})
			.then(function (response) {
				return PropertySvr.propertyAdditionals('additionalExclusion').then(function (response) {
					$scope.exclusion =	response;
				});
			}).then(function(response){
				return PropertySvr.propertyAdditionals('additionalService').then(function(response){
					$scope.paid_services_info = response;

					// Get the property details by slug
					propertyInfo();
				});			
			});
		};
		
		function propertyInfo(){
			RestSvr.get('property_detail/' + $routeParams.slug)
			.then(function(response){
				if(response.errors){
					toastService.alert({message: response.errors.message, class: 'error'});
				} else {				
					$scope.property = response.record;
					managePaidServicesList();
					$scope.available_date = new Date($scope.property.available_date);
					$scope.viewing_date = ($scope.property.viewing_date) ? new Date($scope.property.viewing_date) : currentDate;
				}
			})
			.then(function (response) {
				postCodeLookUp();
			});
		}

		/*removed purchased services from list*/
		function managePaidServicesList(){
			$scope.property.paid_services.map(function(o){
				$scope.paid_services_info = $scope.paid_services_info.filter(function(obj){
					return obj._id !== o._id;
				});
			});	
		}

		// Dropzone options
		$scope.dropzoneConfig = {
			'options': { // passed into the Dropzone constructor
				url: 'update_property',
				paramName: 'file',
				autoProcessQueue: true,
				maxFilesize: 2, // MB
				headers: {"Authorization": "Bearer " + localStorageService.get('token', localStorageService.get('staySignedIn'))},
				acceptedFiles:"image/jpeg,image/jpg,image/png",
				addRemoveLinks: true, // For adding the remove links
				uploadMultiple: true,
				dictRemoveFile: 'x', // For remove link files text
				dictCancelUpload: 'x',
				parallelUploads: 10,
				maxFiles: 10,
				dictFileTooBig:'File size must be small from {{maxFilesize}} MB',
				dictMaxFilesExceeded: 'You can only upload {{maxFiles}} files at once',
				init: function() {
					myDropzone = this;
				}
			},
			'eventHandlers': {
				addedfile: function(file){
				},
				sendingmultiple: function (file, xhr, formData) {
					formData.append("property", angular.toJson($scope.property));	
				},
				success: function (file) {
					myDropzone.removeFile(file);
				},
				'successmultiple': function (file, res) {
					propertyInfo();
					
				}
			}
		};		

		/**
		 * https://ideal-postcodes.co.uk/documentation
		 */
		$scope.findByPostcode = function(toast){

			// Clear all the fields
			$scope.property.address.address1 = null;
			$scope.property.address.address2 = null;
			$scope.property.address.county = null;
			$scope.property.address.town = null;
			$scope.property.address.latitude = null;
			$scope.property.address.longitude = null;
			postCodeLookUp(toast);
		};

		function postCodeLookUp (toast){
			
			if( angular.isUndefined($scope.property.address) ){
				$scope.postcodeinvalid = true;
				$scope.postcodeResults = [];
				return;
			}
			var postcode = $scope.property.address.postcode;
			PostcodeSvr.lookup(postcode, true).then(function(response){
				$scope.postcodeResults = response.data.result;
				$scope.postcodeinvalid = false;

				if(toast){
					toastService.alert({message: 'Postcode found', class: 'success'});
				}
			}, function(err){
				$scope.postcodeinvalid = true;
				$scope.postcode_response_message = err.data.message;
				$scope.postcodeResults = [];
			});
		}

		/**
		 * Get the index of selected address
		 */
		$scope.getIndex = function(index){
			var addressIndex = index || 0;
			$scope.property.address.latitude = $scope.postcodeResults[addressIndex].latitude;
			$scope.property.address.longitude = $scope.postcodeResults[addressIndex].longitude;
		};

	    /*redirect to additional services checkout page*/
        $scope.checkOut = function(isValid){
        	$scope.isCheckout = true;
            $scope.update(isValid);
        };

		/* update property */
		$scope.update = function(isValid){
			if(!isValid){
				return toastService.alert({message: 'Please Check Above Errors!', class: 'error'});
			}
			$scope.spinner = true;
			$scope.property.available_date = $scope.available_date;
			$scope.property.viewing_date = $scope.viewing_date;
			$scope.property.user_id = $scope.property.user_id._id;
			processData();
			/* Get queue files length */
			/*
			* Auto process files 
			if(myDropzone.getQueuedFiles().length > 0){
				myDropzone.processQueue();	// Process the queue
			} else {
				processData(); // Process data without files
			}*/
		};

		/* Process/Save the data without images 
		* This function will only execute if user has not uplaod any files
		* getQueuedFiles length is zero
		*/
		function processData() {
			RestSvr.post('update_property', $scope.property)
			.then(response);
		}

		function response(response) {
	    	$scope.spinner = false;
	    	if (response.errors) {
				toastService.alert({message: response.errors.message, class: 'error'});
            } else {
            	
				if ($scope.isCheckout) {
					$location.path('/checkout/'+$routeParams.slug);
				}else{
					toastService.alert({message: response.data.message || response.message, class: 'success'});
					$location.path('property-listings');
				}				
	    	}
	    }	

		/* calculate monthly rent 
		* http://www.chelmsfordroomstorent.co.uk/how-to-calculate-monthly-rents-from-advertised-weekly-rents/
		* weekly price x  52 (number of weeks in a year) / 12 (number of months in a year)
		*/
		$scope.weekly = function (weekly) { 
		    $scope.property.monthly_rent = weekly !== undefined ? ((weekly * 52) / 12).toFixed(2) : 0;
		};

		/* calculate weekly rent 
		* http://www.chelmsfordroomstorent.co.uk/how-to-calculate-monthly-rents-from-advertised-weekly-rents/
		* monthly price x  12 (number of months in a year) / 52 (number of weeks in a year)
		*/
		$scope.monthly = function (monthly) {
		    $scope.property.weekly_rent = monthly !== undefined ? ((monthly * 12) / 52).toFixed(2) : 0;
		};

		/* Md-Checkbox toggle */
		$scope.toggle = function (item, list) {
			
			
		    var removeIndex = list.map(function(o) {
		        return o._id;
		    }).indexOf(item._id);
		    if (removeIndex === -1) {
		        list.push(item);
		        if(  !localStorageService.get('tutorial') ){
		        	$timeout(function(){
		        		$scope.CallMe();
		        	},100);	
		        }
		        toastService.alert({message: item.name+" added to basket" , class: 'success'});
		    } else {
		        list.splice(removeIndex, 1);
		        toastService.alert({message: item.name+" removed from basket" , class: 'success'});
		    }
		};

		/* Return existing items from paid services */
		$scope.exists = function (item, list) {
		    var removeIndex = list.map(function(o) {
		        return o._id;
		    }).indexOf(item._id);
		    if (removeIndex === -1) {
		        return false;
		    } else {
		        return true;
		    }			
	    };		

	    $scope.property.floor_plan = [];
	    /* Md-Checkbox toggle */
		$scope.toggleFloorPlan = function (item, list) {
		    var removeIndex = list.map(function(o) {
		        return o.name;
		    }).indexOf(item.name);
		    if (removeIndex === -1) {
		        list.push(item);
		    } else {
		        list.splice(removeIndex, 1);
		    }
		};

		/* Return existing items from floorplan*/
		$scope.existsFloorPlan = function (item, list) {
		    var removeIndex = list.map(function(o) {
		        return o.name;
		    }).indexOf(item.name);
		    if (removeIndex === -1) {
		        return false;
		    } else {
		        return true;
		    }			
	    };

	    /* Remove Photo */
	    $scope.removePhoto = function (index,data,event) {
	    	var image = data[index];
	    	dialogService.confirm({ text: 'Are you sure want delete image ?', ok: 'Delete' },event)
            .then(function(result) {
                /* user has pressed cancel button */
            }, function(ok){
				RestSvr.put('remove_property_photo/', $scope.property._id, {'image': image}).then(function(response){
		    		if (response.errors) {
						toastService.alert({message: response.errors.message, class: 'error'});
		            } else {
		            	data.splice(index, 1); 
		            	if($scope.property.cover_photo && image.name === $scope.property.cover_photo.name){
		            		delete $scope.property.cover_photo; // delete property cover photo
		            	}
		            	//toastService.alert({message: response.message, class: 'success'});
			    	}
		    	});
			});
	    	
	    };

	    /* Get the image object and put it in cover photo */
	    $scope.getImageObj = function (image) {
	    	$scope.property.cover_photo = image;
	    };

	    $scope.IntroOptions = {
           steps:[
           {
               element: '#step1',
               intro: "This is your basket, you can click here anytime and proceed to checkout.",
               position: 'left'
           }
           ],
           showStepNumbers: false,
           exitOnOverlayClick: true,
           exitOnEsc:true,
           showBullets: false,
           doneLabel: '<strong>Thanks</strong>'
       };

       	$scope.CompletedEvent = function (scope) {
            localStorageService.set('tutorial','complete','localStorage');
        };

        $scope.ExitEvent = function (scope) {
			localStorageService.set('tutorial','complete','localStorage');
        };
	}
]);	