'use strict';

angular.module('app.controllers')
.controller('propertyPreviewCtrl', ['$scope', 'RestSvr', '$routeParams', 'toastService', 'localStorageService','$location','PropertySvr','$filter','GOOGLEMAP',
	function ($scope, RestSvr, $routeParams, toastService, localStorageService, $location, PropertySvr,$filter,GOOGLEMAP) {
		// Get the property details by slug
		RestSvr.get('property_detail/' + $routeParams.slug, {cache: true})
		.then(function(response){
			if(response.errors){
				toastService.alert({message: response.errors.message, class: 'error'});
			} else {
				$scope.property = response.record;
				$scope.fullAddress = [$scope.property.address.latitude , $scope.property.address.longitude];
			}
		});

		$scope.property_additional_exclusion = PropertySvr.getPropertyExclusion();
		$scope.property_rental_type = PropertySvr.getPropertyRentalType();
		$scope.googleMapsUrl = GOOGLEMAP.API_URL + "?key=" + GOOGLEMAP.API_KEY;
		
    }
]);