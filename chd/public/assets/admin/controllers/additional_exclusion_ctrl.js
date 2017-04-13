app.controller('additionalExclusionCtrl', ['$window', '$routeParams', 'useAlertService', 'AlertService', '$http', 'validationError', '$mdConstant', '$scope', 'RestSvr', '$location',
    function($window, $routeParams, useAlertService, AlertService, $http, validationError, $mdConstant, $scope, RestSvr, $location) {

        $scope.additionalExclusion = {};
        $scope.additionalExclusion.exclusion = [];
        $scope.additionalExclusion.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, 186];

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

        /*add new Additional Exclusion*/
        $scope.addAdditionalExclusion = function() {
            var exclusionDetail = {
                list: $scope.additionalExclusion.exclusion,
                exclusion_type: $scope.additionalExclusion.exclusion_type
            };
            RestSvr.post('/admin/new-additional-exclusion', exclusionDetail).then(function(response) {
                useAlertService.alert(response);
                if (response.result) {
                    $location.path('/property-management/additional-exclusion');
                }
            });
        };
        /*get Additional Exclusion detail by using its id*/
        $scope.editpage = function(id) {
            $location.path('/property-management/additional-exclusion/edit/' + id);
        };

        $scope.getAdditionalExclusionDataToedit = function() {
            $scope.pageHeader = 'Edit additional exclusion';
            RestSvr.getById('/admin/get-additional-exclusion?id=' + $routeParams.id).then(function(response) {
                if (response.result) {
                    $scope.newadditionalExclusion = response.data.additional_exclusion[0];
                } else {
                    useAlertService.alert(response);
                }
            });
        };

        /*update Additional Exclusion detail to perform edit/update*/
        $scope.update = function(data) {
            var exclusionDetail = {
                text: data.name,
                sale: data.sale,
                tooltip_text: data.tooltip_text
            };
            RestSvr.put('/admin/update-additional-exclusion/', $routeParams.id, exclusionDetail).then(function(response) {
                useAlertService.alert(response);
                if (response.result === true) {
                    $location.path('/property-management/additional-exclusion');
                }
            });
        };

        /*change additional exclusion state*/
        $scope.activeInactive = function(id, status, name, index){
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
                        var state = {
                            status: status
                        };                        
                        RestSvr.put('/admin/active-inactive-additional-exclusion/', id, state).then(function(response) {                            
                             $scope.additionalExclusionRecord[index].status = updated;
                             useAlertService.alert(response);
                        });
                    }
                }
            });
        };

        $scope.delete = function(id, index, name){
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
                        RestSvr.delete('/admin/delete-additional-exclusion/'+id).then(function(response){
                            useAlertService.alert(response);
                            $scope.additionalExclusionRecord.splice(index, 1);
                        });
                    }
                }
            });            
        };

        /*redirect to Additional Exclusion listing page*/
        $scope.addAdditionalExclusionPage = function() {
            $location.path('/property-management/additional-exclusion/new');
        };

        /*get Additional Exclusion list and show*/
        $scope.additionalExclusionList = function() {
            $scope.pageHeader = 'Additional Exclusion';
            RestSvr.get('/admin/get-additional-exclusion-list').then(function(response) {
                if (response.record === null) {
                    $scope.additionalExclusionRecord = [];
                } else {
                    $scope.additionalExclusionRecord = response.record.additional_exclusion;
                }

            });
        };
        /*fire invalid form error message if form is invalid */
        $scope.validate = function() {
            validationError.alert();
        };

        $scope.back = function() {
            $window.history.back();
        };
    }
]);