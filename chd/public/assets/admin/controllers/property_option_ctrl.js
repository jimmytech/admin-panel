app.controller('propertyOptionCtl', ['useAlertService', 'RestSvr', '$routeParams', '$location', '$window', '$scope', '$mdConstant', 'validationError',
    function(useAlertService, RestSvr, $routeParams, $location, $window, $scope, $mdConstant, validationError) {

        $scope.type = {};
        $scope.type.name = [];
        $scope.type.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, 186];

        /*category list for Additional Exclusion ex- sale or rent*/
        $scope.categoryLst = [{
            id: 'sale',
            name: 'Sale'
        }, {
            id: 'rent',
            name: 'Rent'
        }, {
            id: 'both',
            name: 'Sale And Rent'   
        }];

        /*fire invalid form error message if form is invalid */
        $scope.validate = function() {
            validationError.alert();
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.addNewType = function(type) {
            var data = {
                list: $scope.type.name,
                type: type,
                option_type: $scope.type.option_type
            };
            RestSvr.post('/admin/newOptionType', data).then(function(response) {
                useAlertService.alert(response);
                if (response.result) {
                    $location.path('/property-management/option');
                }
            });
        };


        $scope.new = function(type) {
            $location.path('/property-management/option/new/' + type);

        };

        $scope.selectDiv = function() {
            var propertyOPtionArray = ['new-rent-sale', 'new-heating', 'new-location', 'new-authority', 'new-property-age', 'new-property-style', 'new-parking'];
            if (propertyOPtionArray.indexOf($routeParams.type) == -1) {
                alert('invalid request');
                $location.path('/property-management/option');
            } else {
                switch ($routeParams.type) {
                    case 'new-rent-sale':
                        $scope.pageHeader = 'New Rent/Sale Type';
                        break;

                    case 'new-heating':
                        $scope.pageHeader = 'New Heating Type';
                        break;

                    case 'new-location':
                        $scope.pageHeader = 'New Location';
                        break;

                    case 'new-authority':
                        $scope.pageHeader = 'New Local Authority';
                        break;

                    case 'new-property-age':
                        $scope.pageHeader = 'New Property Age';
                        break;

                    case 'new-property-style':
                        $scope.pageHeader = 'New Property Style';
                        break;

                    case 'new-parking':
                        $scope.pageHeader = 'Add Parking Option';
                        break;
                }
            }
        };

        $scope.getData = function() {
            RestSvr.get('/admin/get-options').then(function(response) {
                $scope.propertyTypeRecord = response.record;
            });
        };

        $scope.edit = function(id, type) {
            $location.path('/property-management/option/edit/' + type +'/'+id);
        };

        /*change additional exclusion state*/
        $scope.activeInactive = function(id, status, name, index, type){
            bootbox.confirm({
                title: "Change status?",
                message: 'Are you sure you want to update ' + name + '?',
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: function(result) {
                    var updated = status === false? true : false;
                    if (result === true) {
                        var data = {
                            status: updated,
                            type: type
                        };                 
                        RestSvr.put('/admin/active-inactive-additional-option/', id, data).then(function(response) {                            
                             // $scope.propertyTypeRecord[index].status = updated;
                             $scope.getData();
                             useAlertService.alert(response);
                        });
                    }
                }
            });
        }; 

        $scope.getDataToedit = function() {
            $scope.pageHeader = 'Edit Property Type';
            RestSvr.getById('/admin/get-option-edit?id=' + $routeParams.id+'&&type='+$routeParams.type).then(function(response) {
                if (response.result) {
                    var label = setLabel($routeParams.type);
                    $scope.propertyType = response.data[$routeParams.type][0];
                } else {
                    useAlertService.alert(response);
                }
            });
        };

        function setLabel (type){
                switch (type) {
                    case 'property_type':
                        $scope.label = 'Rent/Sale Type';
                        break;

                    case 'heating':
                        $scope.label = 'Heating Type';
                        break;

                    case 'location':
                        $scope.label = 'Location';
                        break;

                    case 'authority':
                        $scope.label = 'Local Authority';
                        break;

                    case 'age':
                        $scope.label = 'Property Age';
                        break;

                    case 'style':
                        $scope.label = 'Property Style';
                        break;

                    case 'parking':
                        $scope.label = 'Parking';
                        break;
                }
        }
        /*update Additional Exclusion detail to perform edit/update*/
        $scope.update = function(data) {
            var updated = {
                name: data.name,
                sale: data.sale,
                type: $routeParams.type,
                option_type: data.option_type
            };
            RestSvr.put('/admin/update-additional-option/', $routeParams.id, updated).then(function(response) {
                useAlertService.alert(response);
                if (response.result === true) {
                    $location.path('/property-management/option');
                }
            });
        };

        $scope.delete = function(id, index, name, type){
            bootbox.confirm({
                title: "Delete?",
                message: 'Are you sure you want to Delete ' + name + '?',
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: function(result) {
                    if (result === true) {
                        RestSvr.delete('/admin/delete-additional-option/'+id + '/'+type).then(function(response){
                            useAlertService.alert(response);
                            $scope.getData();
                            // $scope.additionalExclusionRecord.splice(index, 1);
                        });
                    }
                }
            });            
        };             

    }
]);