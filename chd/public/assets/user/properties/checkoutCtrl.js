'use strict';
angular.module('app.controllers')
.controller('checkoutCtrl', ['$scope', 'RestSvr', '$routeParams', 'toastService', 'localStorageService','$location','PropertySvr','dialogService','$mdDialog','$document',
	function ($scope, RestSvr, $routeParams, toastService, localStorageService, $location, PropertySvr, dialogService, $mdDialog, $document) {
        var property;
        $scope.quantity = 1;
        /**
         * Fetch required property details
         * @ propertyByID
         */



         $scope.additionalServiceList = function(){
            RestSvr.get('/checkout_additional_service_list/'+$routeParams.slug).then(function(response){
                $scope.items = response.record.cart;
                $scope.propertyId = response.record._id;
                $scope.price = 0;
                $scope.items.map(function(p){
                    $scope.price = $scope.price+p.price;
                });    
                var host = window.location.hostname;
                var protocol = window.location.protocol;
                var port = window.location.port;
                $scope.url = protocol+'//'+host+':'+port;
                $scope.notifyUrl = protocol+'//'+host+':'+port+'/successfull_payment';
                $scope.custom = {"email": "email@email.com", "propertyId": response.record._id};                          
            });
         };

        $scope.price = 10;

        /* Checkout confirmation dialog*/
        $scope.checkout = function(){
    	    $mdDialog.show({
                locals:{dataToPass: $scope.items},
                controllerAs: 'ctrl',
    		    templateUrl: 'assets/user/properties/views/checkout-popup.html',
    		    parent: angular.element($document.body),
    		    clickOutsideToClose:true,
                scope: $scope.$new()
    	 	});
        };


        /* Remove item from cart */
        $scope.remove = function(index, event, id, price){
	        dialogService.confirm({ text: 'Are you sure want to remove ?', ok: 'Yes' },event)
	        .then(function(result) {
	            /* user has pressed cancel button */
	        }, function(ok){
	            return RestSvr.put('remove_item/', $scope.propertyId  +'/'+ id);
	        })
	        .then(function(response){
	        	if(response.errors){
	        		toastService.alert({message: response.errors.message, class: 'error'});
	        	} else {
                    $scope.items.splice(index, 1);
                    $scope.price = $scope.price-price;
	        		toastService.alert({message: response.message, class: 'success'});
	        		if($scope.total_no_items === 0){
	        			$location.path('property_listings');	
	        		}
	        	}
	        });
	    };  

         $scope.cancel = function() {
             $mdDialog.hide();
         };       
    }
]);