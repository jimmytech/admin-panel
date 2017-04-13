'use strict';

angular.module('app.controllers')
.controller('propertiesCtrl', ['$scope', 'RestSvr', 'toastService', 'localStorageService','$location','PropertySvr','PostcodeSvr',
	function ($scope, RestSvr, toastService, localStorageService, $location, PropertySvr, PostcodeSvr) {
		var user = localStorageService.get('user', localStorageService.get('staySignedIn','localStorage'));
		var myDropzone, addressIndex; // Dropzone instance
		var self = this;
		
		/* Intialize property object */
		$scope.step1 = {}; $scope.step2 = {}; $scope.step3 = {};
		$scope.spinner = false;$scope.spinner1 = false;

		/* Only intialize at step 1 */
		if($location.path() === '/property-room-details'){
			//$scope.step1.features = []; // define features as an empty array 
			PropertySvr.propertyAdditionals('additionalFeature')
			.then(function (r) {
				$scope.featuresX = r;
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
			});
		}
		
		/* Only intialize at step 2 */
		if($location.path() === '/property-tenancy-details' || $location.path() === '/property-sale-details'){

			/* Check if user complete step 1 or not , Redirect user to step 1 if not completed */
			if(localStorageService.get('step1', 'localStorage') === null){
				$location.path('property-room-details');
			}
			

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

			/* Get the static values for property exclusion */
			PropertySvr.propertyAdditionals('additionalExclusion').then(function (response) {
				$scope.exclusion =	response;
			});
			
		}

		/* Only intialize at step 3 */
		if( $location.path() === '/property-media' ){

			/* Check if user complete step 1 and step 2 or not , Redirect user to step 1, 2 if not completed */
			if( localStorageService.get('step1', 'localStorage') === null && localStorageService.get('step2', 'localStorage') === null){
				$location.path('property-room-details');
			} else if( localStorageService.get('step2', 'localStorage') === null ){
				$location.path('property-tenancy-details');
			}

			$scope.step3.cart = [];
				PropertySvr.propertyAdditionals('additionalService').then(function(response){
					$scope.paid_services_info = response;
				});	
			
		}

		/* Step 1 */
		$scope.firstStep = function(isValid){			
			if(!isValid){
				return toastService.alert({message: 'Please fill all required fields', class: 'error'});
			}

			/*if($scope.step1.features.length === 0){
				return;
			}*/
			

			/* Store user data to localStorage to show next time */
			localStorageService.set('step1', $scope.step1, 'localStorage');
			
			
			if($scope.step1.property_for === 'sale'){
				$location.path('property-sale-details');
			} else {
				$location.path('property-tenancy-details');
			}
			
		};

		/* Step 2 */
		$scope.secondStep = function(isValid){
			if (!isValid) {
				return;
			}

			if( Number($scope.step2.max_price) <= Number($scope.step2.min_price) ){
				toastService.alert({message: 'Max Price should be greater from Min Price', class:'error'});
				return;
			}
			/* Store the dates in storage object */
			$scope.step2.available_date = $scope.available_date;
			$scope.step2.viewing_date = $scope.viewing_date;
			$scope.step2.upload_by = user.role;
			localStorageService.set('step2', $scope.step2, 'localStorage');
			$location.path('property-media');
		};

		if(localStorageService.get('step1', 'localStorage')){
			$scope.step1 = localStorageService.get('step1', 'localStorage');
			
			if( !angular.isUndefined($scope.step1.address) ){
				postCodeLookUp();
			}	
			
		}
		

		if(localStorageService.get('step2', 'localStorage')){

			/* extract the data from storage and update the user */
			$scope.step2 = localStorageService.get('step2', 'localStorage');
			$scope.available_date = new Date($scope.step2.available_date);
			$scope.viewing_date = new Date($scope.step2.viewing_date);
		}

		/* Final Step */
		$scope.finalStep = function(isValid){
			if(!isValid){
				return;
			}
			
			if($scope.step3.submit_n_preview === 1){
				$scope.spinner = true;
			} else {
				$scope.spinner1 = true;
			}

			localStorageService.set('step3', $scope.step3, 'localStorage');
			$scope.step3 = localStorageService.get('step3', 'localStorage');

			/* Get queue files length */
			if(myDropzone.getQueuedFiles().length > 0){
				myDropzone.processQueue();	// Process the queue
			} else {
				processData(); // Process data without files
			}
		};

		/* Process/Save the data without images 
		* This function will only execute if user has not uplaod any files
		* getQueuedFiles length is zero
		*/
		function processData() {			
			var property = Object.assign($scope.step1, $scope.step2, $scope.step3, {'user_id': user._id});		
			RestSvr.post('property', property)
			.then(response);
		}
		
		$scope.dropzoneConfig = {
			'options': { // passed into the Dropzone constructor
				url: 'property',
				paramName: 'file',
				autoProcessQueue: false,
				maxFilesize: 2, // MB
				headers: {"Authorization": "Bearer " + localStorageService.get('token', localStorageService.get('staySignedIn'))},
				acceptedFiles:"image/*",
				addRemoveLinks: true,
				uploadMultiple: true,
				dictRemoveFile: 'x',
				dictCancelUpload: 'x',
				parallelUploads: 10,
				maxFiles: 10,
				// previewTemplate: document.getElementById('preview-template').innerHTML,
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
					var property = Object.assign($scope.step1, $scope.step2, $scope.step3 , {'user_id': user._id});
					formData.append("property", angular.toJson(property));	
				},
				'successmultiple': function (file, res) {
					response(res);
				}
			}
		};

		/* Polyfill 
		* This polyfill doesn't support symbol properties, since ES5 doesn't have symbols anyway:
		*/
		if (typeof Object.assign != 'function') {
			(function () {
				Object.assign = function (target) {
			      	// We must check against these specific cases.
			      	if (target === undefined || target === null) {
			      		throw new TypeError('Cannot convert undefined or null to object');
			      	}

			      	var output = Object(target);
			      	for (var index = 1; index < arguments.length; index++) {
			      		var source = arguments[index];
			      		if (source !== undefined && source !== null) {
			      			for (var nextKey in source) {
			      				if (source.hasOwnProperty(nextKey)) {
			      					output[nextKey] = source[nextKey];
			      				}
			      			}
			      		}
			      	}
					return output;
		  		};
			})();
		}

		/* calculate monthly rent 
		* http://www.chelmsfordroomstorent.co.uk/how-to-calculate-monthly-rents-from-advertised-weekly-rents/
		* weekly price x  52 (number of weeks in a year) / 12 (number of months in a year)
		*/
		$scope.weekly = function (weekly) { 
		    $scope.step2.monthly_rent = weekly !== undefined ? ((weekly * 52) / 12).toFixed(2) : 0;
		};

		/* calculate weekly rent 
		* http://www.chelmsfordroomstorent.co.uk/how-to-calculate-monthly-rents-from-advertised-weekly-rents/
		* monthly price x  12 (number of months in a year) / 52 (number of weeks in a year)
		*/
		$scope. monthly = function (monthly) {
		    $scope.step2.weekly_rent = monthly !== undefined ? ((monthly * 12) / 52).toFixed(2) : 0;
		};

		/* Md-Checkbox toggle */
		$scope.toggle = function(item, list) {
		    var removeIndex = list.map(function(o) {
		        return o._id;
		    }).indexOf(item._id);
		    if (removeIndex === -1) {
		        list.push(item);
		        toastService.alert({message: item.name+" added to basket" , class: 'success'});
		    } else {
		        list.splice(removeIndex, 1);
		        toastService.alert({message: item.name+" removed from basket" , class: 'success'});
		    }
		};

		/* Return existing items from paid services */
		$scope.exists = function(item, list) {
		    var removeIndex = list.map(function(o) {
		        return o._id;
		    }).indexOf(item._id);
		    if (removeIndex === -1) {
		        return false;
		    } else {
		        return true;
		    }
		};


	    /* Go to checkout page */
	    function goToCheckoutPage(slug){
			// Remove all the locally stored data and redirect user to checkout page
			localStorageService.remove('step1', 'localStorage');
			localStorageService.remove('step2', 'localStorage');
			localStorageService.remove('step3', 'localStorage');
	    	$location.path('checkout/' + slug);
	    }

	    function response(response) {
	    	$scope.spinner = false;$scope.spinner1 = false;
	    	if (response.errors) {
                angular.forEach(response.errors, function(error,index){
					toastService.alert({message: error.message, class: 'error'});	
				});
            } else {

            	toastService.alert({message: response.data.message || response.message, class: 'success'});
            	var property_id, slug;
        		if( angular.isUndefined(response.data.record) ) {
        			property_id	= response.data.property_id;
        			slug = response.data.slug;
        		} else {
        			property_id	= response.data.record.property_id;
        			slug = response.data.record.slug;
        		}
            	if($scope.step3.cart.length){
            		goToCheckoutPage(slug);
            	} else {
            		// Remove all the locally stored data and redirect user to checkout page
            		localStorageService.remove('step1', 'localStorage');
            		localStorageService.remove('step2', 'localStorage');
            		localStorageService.remove('step3', 'localStorage');
            		if($scope.step3.submit_n_preview === 1){
            			$location.path('landlord-property-preview/' + slug);	
        			} else {
            			$location.path('property-listings');	
            		}	
				}
            }
	    }
		
		/**
		 * https://ideal-postcodes.co.uk/documentation
		 */
		$scope.findByPostcode = function(toast){

			// Clear all the fields
			$scope.step1.address.address1 = null;
			$scope.step1.address.address2 = null;
			$scope.step1.address.county = null;
			$scope.step1.address.town = null;
			$scope.step1.address.latitude = null;
			$scope.step1.address.longitude = null;
			postCodeLookUp(toast);
		};
		
		function postCodeLookUp (toast){
			if( angular.isUndefined($scope.step1.address) ){
				$scope.postcodeinvalid = true;
				$scope.postcodeResults = [];
				return;
			}
			var postcode = $scope.step1.address.postcode;
			
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
			addressIndex = index || 0;
			$scope.step1.address.latitude = $scope.postcodeResults[addressIndex].latitude;
			$scope.step1.address.longitude = $scope.postcodeResults[addressIndex].longitude;
		};

		$scope.goToStep2 = function(){
			if($scope.step1.property_for === 'sale'){
				$location.path('property-sale-details');
			} else {
				$location.path('property-tenancy-details');
			}
		};

        $scope.searchTerm; // jshint ignore:line
        $scope.clearSearchTerm = function() {
        	$scope.searchTerm = '';
      	};
	    $scope.keyDownEvent = function (ev) {
	    	ev.stopPropagation();
	    };
	}
]);