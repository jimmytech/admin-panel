'use strict';
angular.module('app.controllers')
.controller('propertyDetailCtrl', ['$scope', 'RestSvr', '$routeParams', 'toastService', 'localStorageService','$location','PropertySvr','GOOGLEMAP','$rootScope','fancyboxService',
	function ($scope, RestSvr, $routeParams, toastService, localStorageService, $location, PropertySvr,GOOGLEMAP,$rootScope, fancyboxService) {

		// Get the property details by slug
		RestSvr.get('property_detail/' + $routeParams.slug)
		.then(function(response){
			if(response.errors){
				toastService.alert({message: response.errors.message, class: 'error'});
			} else {
				$scope.property = response.record;
				$scope.fullAddress = [$scope.property.address.latitude , $scope.property.address.longitude];
			}
		});

		PropertySvr.propertyAdditionals('additionalExclusion').then(function(response){
			$scope.property_additional_exclusion = response;
		});
		
		$scope.googleMapsUrl = GOOGLEMAP.API_URL + "?key=" + GOOGLEMAP.API_KEY;

		$scope.synckBoth = function(number){
			angular.element('#sync1').data('owl.carousel').to(number, 300, true);
		};

		// 
		$scope.path = $location.path();
		$scope.enquiryUser = ($rootScope.user) ? angular.copy($rootScope.user) : null;

		$scope.saveProperty = function (index) {
        	if( $rootScope.user) {
        		var user = $rootScope.user;
        		var property = $scope.property;
        		RestSvr.put('save_property/', user._id, { propertyid: property._id } )
        		.then(function (response) {
        			if( response.errors ){
        				toastService.alert({message: response.errors.message, class: 'error'});
        			} else {
        				localStorageService.set('user', response.data, localStorageService.get('staySignedIn', 'localStorage'));
        				$rootScope.user = response.data;
        				toastService.alert({message: response.message, class: 'success'});
        			}
        		});
        	} else {
        		$location.path('/login');
        	}
        };

        $scope.contact_to_agent = function (isValid, enquiryUser) {
        	if(!isValid) { return; }
        	enquiryUser.property_id = $scope.property._id;
        	enquiryUser.channel = $scope.property.property_for;
        	enquiryUser.property_address = $scope.property.virtual_name;
            enquiryUser.landlord_user = !angular.isUndefined($scope.property.user_id.firstname) ? 
                ($scope.property.user_id.firstname + ' ' + $scope.property.user_id.lastname) : 
                $scope.property.user_id.email;
            enquiryUser.landlord_email = $scope.property.user_id.email; 
            enquiryUser.landlord_id = $scope.property.user_id._id; 
            delete enquiryUser.status;
            $scope.onSubmit = true;
        	RestSvr.put('enquiry/', $scope.property.user_id._id + '/' + $rootScope.user._id, enquiryUser).then(function (response) {
        		$scope.onSubmit = false;
        		if(response.errors){
        			toastService.alert({message: response.errors.message, class: 'error'});
        		} else {
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
                'changeFade'        : 0,                
            };	    	
			fancyboxService.fancyboxPlus()( $scope.floorPlan, $scope.manual2);          	
	    };
	}
]);	