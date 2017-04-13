'use strict';

angular.module('app.controllers')
.controller('searchCtrl', ['fancyboxService','$scope', '$location', 'PostcodeSvr', 'PropertySvr', 'localStorageService','RestSvr','toastService','$timeout', '$rootScope','SearchHistory','$mdDialog',
	function(fancyboxService, $scope, $location, PostcodeSvr, PropertySvr, localStorageService, RestSvr, toastService, $timeout, $rootScope,SearchHistory, $mdDialog){
		/* Fetch the search parameter */
		(function init() {
		    PropertySvr.propertyAdditionals('property_type').then(function(response) {
		            $scope.property_rental = response;
		        })
		        .then(function() {
		            PropertySvr.propertyAdditionals('additionalFeature').then(function(response) {
		                    $scope.additionalFeatureList = response;
		                });
		        });
		}());

		var search = $location.search();
		var storedSearch = localStorageService.get('homePageSearch', 'localStorage');
		$scope.property = !angular.equals(search,{}) ? angular.fromJson(search.q):storedSearch[0];		
		var searchResultPage = localStorageService.get('searchResultPage', 'localStorage');
		$scope.monthly_price = PropertySvr.getMonthlyPrice();
    	$scope.salePrice = PropertySvr.getSalePrice();
		$scope.forceEllipses = true;
		$scope.maxSize = 10;
		$scope.paging = { page: searchResultPage || 1 };
		$scope.spinner = true;



		$scope.querySearch   = function (query) {
			return PostcodeSvr.autocomplete(query, true)
			.then(function(response){
				return response.data.result.hits;
			});
		};

		var load = function (sortBy) {
			var sort = !angular.isUndefined(sortBy)? '&sort=' + sortBy : '';
			RestSvr.search('search', $scope.property, 'page=' + $scope.paging.page + sort).then(function(response){
				$scope.spinner = false;
				if(response.errors){
					toastService.alert({message: response.errors.message, class: 'error'});
				} else {
					$scope.properties = response.records;
					$scope.paging = response.paging;
				}	
			});
		};	

		load();

		$scope.pageChanged = function() {
			load();
			localStorageService.set('searchResultPage', $scope.paging.page, 'localStorage');	
		};

		$scope.advance_search = function () {
			load();

			// TODO - Make the search url beautify
			var property = $scope.property;
			SearchHistory.add('homePageSearch', property);
			$location.search('q', angular.toJson(property));
		};

		/* Sort properties by price */
        $scope.sortByPrice = function (option) {
        	load(option);
        };

        // Save Property (Favourite)
        $scope.saveProperty = function (index) {
        	if( $rootScope.user) {
        		var user = $rootScope.user;
        		var property = $scope.properties[index];
        		RestSvr.put('save_property/', user._id, { propertyid: property._id } )
        		.then(function (response) {
        			if( response.errors ){
        				toastService.alert({message: response.errors.message, class: 'error'});
        			} else {
        				if(response.data){
        					localStorageService.set('user', response.data, localStorageService.get('staySignedIn', 'localStorage'));
        					$rootScope.user = response.data;	
        				}
        				toastService.alert({message: response.message, class: 'success'});
        			}
        		});
        	} else {
        		$location.path('/login');
        	}
        };

        // save search
        $scope.save_search = function () {
        	$location.path('save-search').search('q', angular.toJson($scope.property));
        };

        // Contact Agent dialog
        $scope.showContactAgent = function ($event, index) {
        	if($rootScope.user) {
	        	$scope.propertyOwner = $scope.properties[index];
	        	$scope.enquiryUser = ($rootScope.user) ? angular.copy($rootScope.user) : null;
	        	var parentEl = angular.element(document.body);
	        	$mdDialog.show({
	        		parent: parentEl,
	        		targetEvent: $event,
	        		templateUrl: 'assets/user/properties/views/contact-agent-dialog.html',
	        		clickOutsideToClose:true,
					scope: $scope.$new()
				});	
			} else {
				$location.path('/login');
			}	
        };

        $scope.closeDialog =  function () {
        	$mdDialog.hide();
        };

        $scope.contact_to_agent = function (isValid, enquiryUser) {
        	if(!isValid) { return; }
        	enquiryUser.property_id = $scope.propertyOwner._id;
            enquiryUser.channel = $scope.propertyOwner.property_for;
        	enquiryUser.property_address = $scope.propertyOwner.virtual_name;
            enquiryUser.landlord_user = !angular.isUndefined($scope.propertyOwner.user_id.firstname) ? 
                ($scope.propertyOwner.user_id.firstname + ' ' + $scope.propertyOwner.user_id.lastname) : 
                $scope.propertyOwner.user_id.email;
            enquiryUser.landlord_email = $scope.propertyOwner.user_id.email; 
            enquiryUser.landlord_id = $scope.propertyOwner.user_id._id; 
        	delete enquiryUser.status;
        	$scope.onSubmit = true;
        	RestSvr.put('enquiry/', $scope.propertyOwner.user_id._id + '/' + $rootScope.user._id, enquiryUser).then(function (response) {
        		$scope.onSubmit = false;
        		if(response.errors){
        			toastService.alert({message: response.errors.message, class: 'error'});
        		} else {
        			$scope.closeDialog();
        			toastService.alert({message: response.message, class: 'success'});
        		}
        	});
        };

	    /*floor plan preview*/
	    $scope.showFloorPlan = function(url, ev) {
 			var host = window.location.hostname;
            var protocol = window.location.protocol;
            var port = window.location.port;
            var baseUrl = protocol+'//'+host+':'+port+'/';
	    	 $scope.floorPlan = url.map(function(u){
	    		return baseUrl+u.path+u.name;
	    	});
            $scope.manual2={
                'padding'			: 0,
                'transitionIn'		: 'none',
                'transitionOut'		: 'none',
                'type'              : 'image',
                'changeFade'        : 0
            };	    	
			fancyboxService.fancyboxPlus()( $scope.floorPlan, $scope.manual2);          	              	
	    };  

        $scope.searchTerm; // jshint ignore:line
        $scope.clearSearchTerm = function() {
        	$scope.searchTerm = '';
      	};

	    $scope.keyDownEvent = function (ev) {
	    	ev.stopPropagation();
	    };	     

	    $scope.isValidPostcode = function(){

	    	/*validate postcode and get 
	    		(longitude, latitude)*/
			PostcodeSvr.lookup($scope.property.search_address, true).then(function(postcodeResponse){
				$scope.coordinates = [parseFloat(postcodeResponse.data.result[0].longitude), parseFloat(postcodeResponse.data.result[0].latitude)];
				$scope.property.coordinates = $scope.coordinates;
			}, function(err){

				/*if post code is invalid get 
					(longitude, latitude) by using address*/
				findbyAddress();				
			});
	    };  

	    function findbyAddress () {

	    	/*get (longitude, latitude) by address*/
			PostcodeSvr.address($scope.property.search_address, true).then(function(addressResponse){					
				if (addressResponse.data.result.hits.length>0) {
					$scope.coordinates = [addressResponse.data.result.hits[0].longitude, addressResponse.data.result.hits[0].latitude];
					$scope.property.coordinates = $scope.coordinates;					
				}else{

					/*postcode and address both are invalid*/
					toastService.alert({message: 'You need to enter valid post code or address for mile search', class: 'error'});
					$scope.property.radius = 'any';					
				}
			});	    	
	    }
	    $scope.more_refine = localStorageService.get('isMoreRefinement','localStorage') || false;
	    $scope.isMoreRefineOpen = function(){
	    	var more_refine = {true: false, false: true};
	    	$scope.more_refine = more_refine[$scope.more_refine];
	    	localStorageService.set('isMoreRefinement', $scope.more_refine, 'localStorage');	 
	    };
	}
]);	