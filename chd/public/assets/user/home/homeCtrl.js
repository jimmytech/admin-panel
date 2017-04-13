'use strict';

angular.module('app.controllers')
.controller('homeCtrl', ['$scope', '$location', 'PostcodeSvr', 'PropertySvr', 'localStorageService','RestSvr','SearchHistory',
	function($scope, $location, PostcodeSvr, PropertySvr, localStorageService, RestSvr, SearchHistory){

    $scope.querySearch   = querySearch;
    PropertySvr.propertyAdditionals('property_type').then(function (response) {
		$scope.property_rental = response;
	});
    function querySearch (query) {
    	return PostcodeSvr.autocomplete(query, true)
    	.then(function(response){
    		return response.data.result.hits;
    	});
    }

    // weekly prices
    $scope.monthly_price = PropertySvr.getMonthlyPrice();
    $scope.salePrice = PropertySvr.getSalePrice();
	$scope.items = [{
		title: 'Discover Your Perfect Home',
		text: 'with the most complete source of homes for sale & real estate near you',
		image: 'images/slider-1.jpg'
	}, {
		title: 'This heading text for second slide',
		text: 'This sub-text for second slide',
		image: 'images/slider-1.jpg'
	}];
	$scope.properties = [
		{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1,,000',
			purpose: 'For Sale',
			type: 'Apartment',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem '
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},{
			image: 'images/faeturecal.png',
			price: '$1, 249,000',
			purpose: 'For Sale',
			type: 'Villa in Hialeah, Lorem Ipsum',
			description: 'Lorem Ipsum Dummy Lorem Ipsum Dummy Lorem Ipsum Dummy'
		},
	];

	// Property search for rent
	$scope.rent_search_form = function(rentData){
		rentData.property_for = 'rent';
		if( !angular.isUndefined(rentData.availableDate) ) { rentData.available_date = moment(rentData.availableDate).format('MM-DD-YYYY'); }
		SearchHistory.add('homePageSearch', rentData);
		localStorageService.remove('searchResultPage');
		localStorageService.remove('isMoreRefinement');
		$location.path('property-search-listing').search('q', angular.toJson(rentData));
	};

	// Property search for sale
	$scope.sale_search_form = function(saleData){
		saleData.property_for = 'sale';
		if( !angular.isUndefined(saleData.availableDate) ) { saleData.available_date = moment(saleData.availableDate).format('MM-DD-YYYY'); }
		SearchHistory.add('homePageSearch', saleData);
		localStorageService.remove('searchResultPage');
		localStorageService.remove('isMoreRefinement');
		$location.path('property-search-listing').search('q', angular.toJson(saleData));
	};
}]);