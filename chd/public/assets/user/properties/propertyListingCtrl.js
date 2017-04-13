'use strict';

angular.module('app.controllers')
.controller('propertyListingCtrl', ['fancyboxService','$mdDialog','$scope', 'RestSvr', '$rootScope', 'toastService', 'localStorageService','$location','PropertySvr','dialogService','$timeout','NgMap','$document','GOOGLEMAP',
	function (fancyboxService,$mdDialog,$scope, RestSvr, $rootScope, toastService, localStorageService, $location, PropertySvr,dialogService,$timeout,maps,document,GOOGLEMAP) {


		var user = localStorageService.get('user');
		PropertySvr.propertyAdditionals('additionalExclusion').then(function(response){
			$scope.property_additional_exclusion = response;

		});
		$scope.forceEllipses = true;
		$scope.maxSize = 10;
		$scope.paging = { page: 1 };
		$scope.spinner = true;

		var load = function (isCache, sortBy) {
			var sort = !angular.isUndefined(sortBy)? '&sort=' + sortBy : '';
			RestSvr.paginate('paginate_property/', user._id, 'page=' + $scope.paging.page + sort, {cache: isCache}).then(function(response){
				$scope.spinner = false;
				if(response.errors){
					toastService.alert({message: response.errors.message, class: 'error'});
				}
				else
				{
					$scope.properties = response.records;
					$scope.paging = response.paging;


				}
			});
		};

		load(false);

		$scope.pageChanged = function() {
			load(false);
		};


			//set default map configuration : zoom , center
			$scope.mapConfig=
			{
				"lat":'53.0924591',
				"lng":'-3.1649191',
				"zooms":6
			};
			//google map api and key
			$scope.googleMapsUrl =GOOGLEMAP.API_URL + "?key=" + GOOGLEMAP.API_KEY;

			//create map object
			maps.getMap().then(function(map) {
				$scope.map = map;
				$scope.isMapLoaded=true;
			});


		//set reset and set map on center position
		$scope.mapCenter= function()
		{
		var center = new google.maps.LatLng($scope.mapConfig.lat, $scope.mapConfig.lng);
		$scope.map.setCenter(center); //set default lat long
		$scope.map.setZoom($scope.mapConfig.zooms); //set zoom label
		};
		//function for open map pointer window
		$scope.openMapWindow=function(e,list){
			$timeout(function(){
				 $scope.isLoaded=false; //false loader
			},0);
			 $scope.mapInfo=list; //pass current data on info window
			 $scope.map.showInfoWindow('infoWindow', list._id); //open window with based on _id

		};

		//click anywhwre to close map popup window
		document.on('click', function (e) {
				//$scope.map.hideInfoWindow('infoWindow');
		});



		// Make the property publish or unpublish
		$scope.publish = function(x, index){
			var property = $scope.properties[index];
			var option = x;
			RestSvr.put('property/', property._id, {'isPublished': x}, {cache: true}).then(function(response){
				if(response.errors){
					toastService.alert({message: response.errors.message, class: 'error'});
				} else {
					var previewMessage = {true: 'published', false: 'Un-Published'};
					toastService.alert({message: 'Property has been ' + previewMessage[option]+' successfully', class: 'success'});
				}

			});
		};

		// Remove the property from database
		$scope.delete = function(index, event){
			var property = $scope.properties[index];
			dialogService.confirm({ text: 'Are you sure want delete this property ?', ok: 'Delete' },event)
            .then(function(result) {
                /* user has pressed cancel button */
            }, function(ok){
				RestSvr.delete('property/', property._id).then(function(response){
					if(response.errors){
						toastService.alert({message: response.errors.message, class: 'error'});
					} else {
						toastService.alert({message: response.message, class: 'success'});
					}
					load(false);
				});
			});
		};

		/* Sort properties by price */
        $scope.sortByPrice = function (option) {
        	load(false, option);
        };

        // Edit property
        $scope.editProperty = function (index) {
	    	$location.path('edit-property/' + $scope.properties[index].slug);
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

	    $scope.closeDialog = function(){
	    	$mdDialog.hide();
	    }; 	    	    
  	}
]);

