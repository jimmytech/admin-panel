

app.controller('planManagementCtrl', ['validationError', '$window','$scope', '$rootScope', '$location', 'AlertService', '$mdConstant', '$http', '$routeParams', 'subscriptionPlanService', '$q', '$timeout',
    function(validationError, $window, $scope, $rootScope, $location, AlertService, $mdConstant, $http, $routeParams, subscriptionPlanService, $q, $timeout) {
        this.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
        this.PlanService = [];
        this.PlanAdditionalService = [];
        var semicolon = 186;
        $scope.invalidForm = 'Invalid form! Please fill all required fields*';
        this.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, semicolon];
        $scope.repeat = [{id:'1', name: 'one'},{id:'2', name: 'two'},{id:'3', name: 'three'},
        {id:'4', name: 'four'},{id:'5', name: 'five'},{id:'5', name: 'five'},{id:'5', name: 'five'}];

        Array.prototype.sliceIntoChunks = function(chunkSize) {
                        var chunks = [];
                        var temparray = null;

                        for (var i = 0; i < this.length; i++) {
                            if (i % chunkSize === 0) {
                                temparray = [];
                                chunks.push(temparray);
                            }
                            temparray.push(this[i]);
                        }

                        return chunks;
                    };

        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };
        /*auto select services when admin edit or update plan */
        $scope.exists = function(item, list) {
            if (!list) {
                return;
            } else {
                return list.indexOf(item) > -1;
            }
        };

        $scope.addService = function() {
            var serviceList = this.plan.PlanService;
            if (serviceList.length === 0) {
                AlertService.popUp({
                    title: "",
                    message: "Please fill all required fields",
                    type: 'danger'
                });
            } else {
                $http.post('admin/insertPlanService', serviceList).success(function(response) {
                    if (response.success === true) {
                        AlertService.popUp({
                            title: "Success! ",
                            message: "Added successfully",
                            type: 'success'
                        });
                        $location.path('/subscription-plan/service');
                    } else {
                        AlertService.popUp({
                            title: "Error! ",
                            message: "Please try again",
                            type: 'danger'
                        });
                    }
                });
            }
        };

        $scope.addAdditionalService = function(data) {
            $http.post('admin/insertPlanAdditionalService', data).success(function(response) {
                if (response.success === true) {
                    $location.path('/subscription-plan/additional-service');
                    AlertService.popUp({
                        title: "Success! ",
                        message: "Added successfully",
                        type: 'success'
                    });
                } else {
                    AlertService.popUp({
                        title: "Error! ",
                        message: "Please try again",
                        type: 'danger'
                    });
                }
            });
        };

        $scope.addSubscriptionPlan = function(plan) {
            if ($scope.selected.length === 0) {
                AlertService.popUp({
                    title: "",
                    message: "Please select atleast one service",
                    type: 'danger'
                });
            } else {
                var data = plan;
                data.having_service = $scope.selected;
                $http.post('/admin/insertPlan', data).then(function(response) {
                    if (response.data.success === true) {
                        $location.path('/subscription-plan/plan');
                        AlertService.popUp({
                            title: "Success! ",
                            message: "Added successfully",
                            type: 'success'
                        });
                    } else {
                        AlertService.popUp({
                            title: "Error! ",
                            message: "Please try again11",
                            type: 'danger'
                        });
                    }
                });
            }
        };

        $scope.updateSubscriptionPlan = function(data) {
            var updatedPlan = data;
            var services = $scope.selected;
            if (services.length === 0) {
                AlertService.popUp({
                    title: "Error!",
                    message: "Please select atleast one service",
                    type: 'danger'
                });
            } else {
                $http.post('/admin/updateSubscriptionPlan', updatedPlan).then(function(response) {
                    if (response.data.success === true) {
                        $location.path('/subscription-plan/plan');
                        AlertService.popUp({
                            title: "Changed ! ",
                            message: "Updated successfully.",
                            type: 'success'
                        });
                    } else {
                        AlertService.popUp({
                            title: "Error!",
                            message: "Please try again",
                            type: 'danger'
                        });
                    }
                });
            }
        };

        var filterServiceId = function(item) {
            return item.name;
        };

        var serviceList = function() {
            $http.get('/admin/getSubscriptionRecords?type=' + 'service' + '&&serviceFor=' + 'plan').then(function(response) {
                var obj = response.data.data.services;
                if (!obj) {
                    AlertService.popUp({
                        title: "",
                        message: "No service found to make a plan",
                        type: 'danger'
                    });
                } else {
                    $scope.items = obj.map(filterServiceId);
                }
            });
        };

        $scope.manageAddEditPlanDiv = function() {
            switch ($routeParams.type) {
                case 'new-plan':
                    $scope.pageHeader = "Add New plan";
                    serviceList();
                    $scope.selected = [];
                    break;
                case 'new-service':
                    $scope.pageHeader = "Add New Service";
                    break;
                case 'new-additional-service':
                    $scope.pageHeader = "Add New Additional Service";
                    break;
                case 'service':
                    $scope.pageHeader = 'Edit Service';
                    list = subscriptionPlanService.result;
                    id = $routeParams.id;
                    if (list == 'blank') {
                        $http.get('/admin/getServiceNameById?id=' + id).success(function(response) {
                            if (response.success === true) {
                                var serviceObj = {
                                    name: response.data[0].name,
                                    _id: response.data[0]._id
                                };
                                $scope.selectedRecordToEdit = serviceObj;
                                $scope.cpiedService = angular.copy($scope.selectedRecordToEdit);
                            }
                        });
                    } else {
                        selected = list.filter(function(o) {
                            return o._id == id;
                        });
                        $scope.selectedRecordToEdit = selected[0];
                        $scope.cpiedService = angular.copy($scope.selectedRecordToEdit);
                    }
                    break;
                case 'additional-service':
                    $scope.pageHeader = 'Edit Additional Service';
                    list = subscriptionPlanService.result;
                    id = $routeParams.id;
                    if (list == 'blank') {
                        $http.get('/admin/getAdditionalServiceNameById?id=' + id).success(function(response) {
                            if (response.success === true) {
                                var serviceObj = {
                                    name: response.data[0].name,
                                    _id: response.data[0]._id,
                                    price: response.data[0].price,
                                    description: response.data[0].description
                                };
                                $scope.selectedRecordToEdit = serviceObj;
                            }
                        });
                    } else {
                        selected = list.filter(function(o) {
                            return o._id == id;
                        });
                        $scope.selectedRecordToEdit = selected[0];
                    }
                    break;
                case 'plan':
                    $scope.pageHeader = 'Edit Plan';
                    serviceList();
                    id = $routeParams.id;
                    $http.get('/admin/GetPlanToEdit?id=' + id).then(function(response) {
                        if (response.data.success === true) {
                            $scope.updatedPlan = response.data.data;
                            $scope.selected = response.data.data.having_service;
                        } else {
                            AlertService.popUp({
                                title: "Error!",
                                message: "Try Again",
                                type: 'danger'
                            });
                        }
                    });
            }
        };

        $scope.planAndServiceListing = function() {
            $scope.loadingList = true;
            var url = $location.path();
            var type;
            var objName;
            if (url == "/subscription-plan/plan") {
                $scope.pageHeader = "Subscription Plan ";
                objName = type = 'plan';
            } else if (url == "/subscription-plan/service") {
                $scope.pageHeader = "Service";
                type = 'service';
                objName = 'services';
            } else if (url == "/subscription-plan/additional-service") {
                $scope.pageHeader = "Additional Service ";
                type = 'additionalService';
                objName = 'additional_services';
            }
            $http.get('/admin/getSubscriptionRecords?type=' + type).success(function(response) {
                $scope.loadingList = false;
                if (response.success === true) {
                    if (objName == 'plan') {
                        $scope.subscriptionRecords = response.data;
                        var length=3;
                        var mySlicedArray = $scope.subscriptionRecords.sliceIntoChunks(length);
                         $scope.subscriptionRecords1=mySlicedArray;
                    } else {
                        subscriptionPlanService.result = $scope.subscriptionRecords = response.data[objName];
                        $scope.subscriptionRecordsId = response.data._id;

                        $scope.priceTh = $scope.subscriptionRecords[0].hasOwnProperty('price');
                    }
                } else {
                    $scope.subscriptionRecords = [];
                }
            });
        };

        $scope.activeInactivePlan = function(id, status, name, index) {
            status = status === false ? 'active' : 'inactive';
            var update = status == 'inactive' ? false : true;
            bootbox.confirm({
                title: "Change State?",
                message: 'Are you sure you want to ' + status + " " + name + '?',
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
                        var obj = {
                            mainId: $scope.subscriptionRecordsId,
                            thisId: id,
                            status: status,
                            changeTo: update,
                            type: $routeParams.plan
                        };
                        $http.post('/admin/updatePlanStatus', obj).success(function(response) {
                            if (response.success === true) {
                                $scope.subscriptionRecords[index].status = update;
                                AlertService.popUp({
                                    title: "Changed ! ",
                                    message: "Status changed successfully.",
                                    type: 'success'
                                });
                            } else {
                                AlertService.popUp({
                                    title: "Error!",
                                    message: "Network problem, Please try again",
                                    type: 'danger'
                                });
                            }
                        });
                    }
                }
            });
        };

        $scope.edit = function(id, price, type) {
            if (type == 'plan') {
                    $location.path('/subscription-plan/edit/plan/' + id);
            }else{
                if (!price && type != 'plan') {
                    $location.path('/subscription-plan/edit/service/' + id);
                } else if (price) {
                    $location.path('/subscription-plan/edit/additional-service/' + id);
                }
            }
        };

        $scope.updateServices = function(p) {
            p.previous = $scope.cpiedService;
            $http.post('/admin/updateService', p).success(function(response) {
                if (response.success === true) {
                    $location.path('/subscription-plan/service');
                    AlertService.popUp({
                        title: "Changed ! ",
                        message: "Updated successfully.",
                        type: 'success'
                    });
                } else {
                    AlertService.popUp({
                        title: "Error!",
                        message: "Try again",
                        type: 'danger'
                    });
                }
            });
        };
        
        $scope.updateAdditionalServices = function(additionalServices) {
            $http.post('/admin/updateAdditionalService', additionalServices).success(function(response) {
                if (response.success === true) {
                    $location.path('/subscription-plan/additional-service');
                    AlertService.popUp({
                        title: "Changed ! ",
                        message: "Updated successfully.",
                        type: 'success'
                    });
                } else {
                    AlertService.popUp({
                        title: "Error!",
                        message: "Network problem, Please try again",
                        type: 'danger'
                    });
                }
            });
        };
        $scope.addNew = function(){
            $location.path('/subscription-plan/add/new-'+$routeParams.plan);
        };
       $scope.back = function(){
            $window.history.back();
        };

        $scope.validate = function() {
           validationError.alert();
        };        

    }
]);