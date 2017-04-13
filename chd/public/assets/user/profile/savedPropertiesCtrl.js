'use strict';

angular.module('app.controllers')
.controller('savedPropertiesCtrl', ['$scope', 'RestSvr', '$rootScope','dialogService', 'toastService', 'localStorageService','$location','$timeout','PropertySvr','$mdDialog',
    function ($scope, RestSvr, $rootScope,dialogService, toastService, localStorageService, $location,$timeout,PropertySvr,$mdDialog) {
        PropertySvr.propertyAdditionals('property_type').then(function (response) {
            $scope.property_rental = response;
        });

        $scope.forceEllipses = true;
        $scope.maxSize = 10;
        $scope.paging = { page: 1 };
        $scope.spinner = true;

    	// Fetch all the saved proeprties of user
        var loadSavedProperties = function (sortBy, propertyFor) {
            var sort = !angular.isUndefined(sortBy)? '&sort=' + sortBy : '';
            var property_for = !angular.isUndefined(propertyFor)? '&propertyFor=' + propertyFor : '';
        	RestSvr.paginate('save_property/', $rootScope.user._id, 'page=' + $scope.paging.page + sort + property_for).then(function (response) {
        		if(response.errors){
        			toastService.alert({message: response.errors.message, class: 'error'});
        		} else {
        			$scope.saved_properties = response.records;
                    $scope.paging = response.paging;
                    $scope.group = response.group;
        		}
        	});
        };    

        loadSavedProperties();

        $scope.pageChanged = function() {
            loadSavedProperties();
        };

        // Remove the property from database
        $scope.delete = function(index, event){
            var property = $scope.saved_properties[index];
            dialogService.confirm({ text: 'Are you sure want to remove this property from saved list ?', ok: 'Delete' },event)
            .then(function(result) {
                /* user has pressed cancel button */
            }, function(ok){
                RestSvr.put('save_property/',$rootScope.user._id,{ propertyid: property.properties._id}).then(function(response){
                    if( response.errors ){
                        toastService.alert({message: response.errors.message, class: 'error'});
                    } else {
                        if(response.data){
                            localStorageService.set('user', response.data, localStorageService.get('staySignedIn', 'localStorage'));
                            $rootScope.user = response.data;    
                        }
                        toastService.alert({message: response.message, class: 'success'});
                    }
                    loadSavedProperties();
                });
            });
        };

        /* Sort properties by price */
        $scope.sortByDate = function (option) {
            loadSavedProperties(option);
        };

        /* Fetch properties by specfic property type */
        $scope.propertyFor = function (property_type) {
            loadSavedProperties(undefined, property_type);  
        };

         // Contact Agent dialog
        $scope.showContactAgent = function ($event, index) {
            $scope.propertyOwner = $scope.saved_properties[index];
            $scope.propertyOwner.user_id = $scope.propertyOwner.property_owner;
            $scope.enquiryUser = ($rootScope.user) ? angular.copy($rootScope.user) : null;
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                templateUrl: 'assets/user/properties/views/contact-agent-dialog.html',
                clickOutsideToClose:true,
                scope: $scope.$new()
            }); 
        };

        $scope.closeDialog =  function () {
            $mdDialog.hide();
        };

        $scope.contact_to_agent = function (isValid, enquiryUser) {
            if(!isValid) { return; }
            enquiryUser.property_id = $scope.propertyOwner.properties._id;
            enquiryUser.channel = $scope.propertyOwner.properties.property_for;
            enquiryUser.property_address = $scope.propertyOwner.properties.virtual_name;
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
    }
]);