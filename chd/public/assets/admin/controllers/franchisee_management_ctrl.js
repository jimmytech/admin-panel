app.controller('franchiseeManagementCtrl', ['textAngularManager', '$timeout', '$cookies', 'postcodeService', 'AlertService', 'PostcodeSvr', '$mdDialog', '$rootScope', 'bootboxInfo', 'bootBox', 'RestSvr', '$routeParams', '$mdConstant', '$window', 'useAlertService', 'validationError', '$scope', '$location',
    function(textAngularManager, $timeout, $cookies, postcodeService, AlertService, PostcodeSvr, $mdDialog, $rootScope, bootboxInfo, bootBox, RestSvr, $routeParams, $mdConstant, $window, useAlertService, validationError, $scope, $location) {
        $scope.franchiseeConfirmation = "<p>Dear [Name of the franchisee],</p><blockquote><blockquote><blockquote><p>Congratulations!<br></p><p>We are pleased to inform you that your request to become a franchisee with CherryDoor has been accepted.</p><p>You can follow the Link below to login.</p><p>[http://cherrydoor-dev.flexsin.org:9002/login.html]<br></p>Thanks,<p>Team, Cherrydoor</p><p><br></p><p><br></p><p>​</p></blockquote></blockquote></blockquote>";
        /*get franchise requst data*/
        $scope.requestList = function() {
            RestSvr.get('/admin/franchisee-request-list').then(function(response) {
                $scope.requests = response.record;
            });
        };
        /*redirect to create new account page*/
        $scope.newFranchiseePage = function() {
            $location.path('/franchisee-management/new-franchisee');
        };
        /*fill form is user go back*/
        $scope.fillNewFranchiseeForm = function() {
            if (localStorage.getItem('newfranchiseeInfo')) {
                $scope.newUser = JSON.parse(localStorage.getItem('newfranchiseeInfo'));
            }
        };
        /*convert postcode list to Array*/
        $scope.splitPostcode = function(postcode, name) {
            if (angular.isDefined(postcode)) {
                $cookies.put('requestedPostCode', postcode);
            }
            if (angular.isDefined(name)) {
                $cookies.put('firstname', name);
            }
            $scope.firstname = $cookies.get('firstname');
            // var tempPostcode = $cookies.get('requestedPostCode');
            // console.log(tempPostcode);
            $scope.mypostCode = $cookies.get('requestedPostCode').replace(/,/g, ", ");
            $scope.selectedPostcode = [];
        };
        /*store new franchisee account detail*/
        $scope.storeFranchiseeInfo = function() {
            var postcode = [];
            localStorage.setItem('newfranchiseeInfo', angular.toJson($scope.newUser));
            $scope.splitPostcode(postcode, $scope.newUser.firstname);
            $location.path('/franchisee-management/new/select-post-code');
        };
        /*save franchisee account info and redirect to select postcode page*/
        $scope.assignPostCodePage = function(postCode) {
            localStorage.setItem('franchiseeInfo', angular.toJson($scope.requestDetail));
            $scope.splitPostcode(postCode, $scope.requestDetail.firstname);
            $cookies.put('franchiseeName', $scope.requestDetail.firstname + " " + $scope.requestDetail.lastname);
            $location.path('/franchisee-management/select-post-code');
        };
        /*create new account for franchise*/
        $scope.newFranchiseeRegistration = function() {
            var userInfo = JSON.parse(localStorage.getItem('newfranchiseeInfo'));
            userInfo._id = 1;
            if ($scope.selectedPostcode[0] === 0) {
                var alertInfo = {
                    result: false,
                    message: "Please allocate postcode first"
                };
                useAlertService.alert(alertInfo);
            } else {
                userInfo.intrested_zip = $scope.selectedPostcode;
                userInfo.emailTemplate = $scope.franchiseeConfirmation;
                RestSvr.post('/admin/newAccountByAdmin', userInfo).then(function(response) {
                    useAlertService.alert(response);
                    if (response.result) {
                        localStorage.removeItem("newfranchiseeInfo");
                        $rootScope.$emit("userManagementController");
                        $scope.back();
                    }
                });
            }
        };
        /*after completion of checks process crate franchisee */
        $scope.franchiseeAccount = function() {
            var storageData = JSON.parse(localStorage.getItem('franchiseeInfo'));
            delete storageData.created;
            delete storageData.notes;
            if ($scope.selectedPostcode[0] === 0) {
                var alertInfo = {
                    result: false,
                    message: "Please allocate postcode first"
                };
                useAlertService.alert(alertInfo);
            } else {
                storageData.intrested_zip = $scope.selectedPostcode;
                storageData.emailTemplate = $scope.franchiseeConfirmation;
                localStorage.setItem('franchiseeInfo', angular.toJson(storageData));
                RestSvr.post('/admin/newAccountByAdmin', storageData).then(function(response) {
                    useAlertService.alert(response);
                    if (response.result) {
                        localStorage.removeItem("franchiseeInfo");
                        $rootScope.$emit("userManagementController");
                        $location.path('/franchisee-management/request');
                    }
                });
            }
        };
        /*check sign type */
        $scope.signUp = function() {
            var url = $location.path().split('/').reverse()[1];
            if (url == 'new') {
                $scope.newFranchiseeRegistration();
            } else {
                $scope.franchiseeAccount();
            }
        };
        /*redirect to view page*/
        $scope.view = function(id) {
            $location.path('/franchisee-management/request/view/' + id);
        };        

        $scope.editRequest = function(id) {
            $location.path('/franchisee-management/request/edit/' + id);
        };
        /*view franchisee request detail*/
        $scope.getRequestDetail = function() {
            RestSvr.getById('/admin/get-franchisee-request-detail?id=' + $routeParams.id).then(function(response) {
                if (response.result === false) {
                    $location.path('/franchisee-management/request');
                } else {
                    $scope.requestDetail = response.data;
                }
            });
        };
        /*remove frenchisee request permanently*/
        $scope.delete = function(id, i, name) {
            var detail = bootboxInfo.delete(name);
            bootBox.alert(function(result) {
                if (result) {
                    RestSvr.delete('/admin/delete-franchisee-request/' + id).then(function(response) {
                        useAlertService.alert(response);
                        if (response.result) {
                            $scope.requests.splice(i, 1);
                        }
                    });
                }
            }, detail);
        };
        /*search franchisee request*/
        $scope.search = function(text) {
            RestSvr.get('/admin/search-framchisee-request?search=' + text).then(function(response) {
                $scope.requests = response.record;
            });
        };
        /*refresh request when search bar is empty*/
        $scope.refreshList = function(text) {
            if (text === undefined) {
                $scope.requestList();
            }
        };
        /*fire invalid form error message if form is invalid */
        $scope.validate = function() {
            validationError.alert();
        };
        /*back to previous page*/
        $scope.back = function() {
            $window.history.back();
        };
        /*franchisee list on assign postcode page*/
        $scope.franchiseeList = function() {
            RestSvr.get('/admin/franchisee-list').then(function(response) {
                $scope.franchiseeRecord = response.record;
            });
        };
        /*refresh franchisee when search bar is empty*/
        $scope.refreshFranchiseeList = function(postcode) {
            if (!postcode) {
                $scope.franchiseeList();
            } else {
                $timeout(function() {
                    RestSvr.get('/admin/search-franchisee-by-post-code?postcode=' + postcode).then(function(response) {
                        $scope.franchiseeRecord = response.record;
                        console.log($scope.franchiseeRecord);
                    });
                }, 1000);
            }
        };
        /*filter franchisee list by postcode*/
        function getFranchiseeByPostcode(postcode, type) {
            return RestSvr.get('/admin/get-franchisee-list-for?postcode=' + postcode + "&&type=" + type).then(function(response) {
                return response;
            });
        }
        /*validate postcode*/
        $scope.lookup = function(postcode, name) {
            if ($scope.selectedPostcode.indexOf(postcode) == -1) {
                PostcodeSvr.lookup(postcode, true).then(function(response) {
                    var title = 'Would you like to allocate ' + postcode + '?';
                    var textContent = 'Note: You can allocate same post codes to multiple franchisee(s).';
                    showConfirm(title, textContent).then(function(response) {
                        if (response) {
                            $scope.assignPostcode(postcode);
                        }
                    });
                }, function(err) {
                    var alertInfo = {
                        result: false,
                        message: "Invalid postcode"
                    };
                    useAlertService.alert(alertInfo);
                });
            }
        };
        var showConfirm = function(title, textContent, ev) {
            var confirm = $mdDialog.confirm().title(title).textContent(textContent).ariaLabel('Lucky day').targetEvent(ev).ok('Ok').cancel('Cancel');
            return $mdDialog.show(confirm);
        };
        /*after reviewing franchisee account assign post to franchisee*/
        $scope.assignPostcode = function(postcode) {
            if ($scope.selectedPostcode[0] === 0) {
                $scope.selectedPostcode.shift();
            }
            if ($scope.selectedPostcode.indexOf(postcode) == -1 && angular.isDefined(postcode)) {
                $scope.selectedPostcode.push(postcode.toUpperCase());
                alertInfo = {
                    result: true,
                    message: postcode + " allocated"
                };
                useAlertService.alert(alertInfo);
            }
        };
        $scope.deleteFromPostcodeList = function(postcode) {
            var i = $scope.selectedPostcode.indexOf(postcode);
            $scope.selectedPostcode.splice(i, 1);
            alertInfo = {
                result: true,
                message: postcode + " removed"
            };
            useAlertService.alert(alertInfo);
        };
        /*after making changes and update franchisee request*/
        $scope.updateFranchiseeRequest = function() {
            RestSvr.post('/admin/update-franchisee-request', $scope.requestDetail).then(function(response) {
                useAlertService.alert(response);
            });
        };
        $scope.showPrerenderedDialog = function(ev) {
            if ($scope.selectedPostcode.length === 0) {
                var alertInfo = {
                    result: false,
                    message: "Please allocate postcode first"
                };
                useAlertService.alert(alertInfo);
            } else {
                $mdDialog.show({
                    contentElement: '#myDialog',
                    parent: angular.element('.main-content'),
                    clickOutsideToClose: true
                });
            }
        };
        $scope.closemdDialog = function() {
            $mdDialog.cancel();
        };

        $scope.openPdf = function() {
            var userInfo;
            var url = $location.path().split('/').reverse()[1];
            if (url == 'new') {
                userInfo = JSON.parse(localStorage.getItem('newfranchiseeInfo'));
            } else {
                userInfo = JSON.parse(localStorage.getItem('franchiseeInfo'));
            }
            var docDefinition = {
                content: [{
                    text: "Franchisee"
                }, {
                    table: {
                        body: [
                            ['Name', 'Email', 'Company', 'Postcode'],
                            [userInfo.firstname + " " + userInfo.lastname, userInfo.email, userInfo.company, $scope.selectedPostcode.join(', ')],
                        ]
                    }
                }]
            };
            pdfMake.createPdf(docDefinition).open();
        };



    }
]);