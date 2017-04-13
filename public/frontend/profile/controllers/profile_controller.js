'use strict';


app.controller('profileCtrl', ['$log', '$timeout', '$q', 'australia', 'Upload', 'toastyService', 'localData', '$scope', '$location', '$rootScope', 'http', '$mdDialog',
    function($log, $timeout, $q, australia, Upload, toastyService, localData, $scope, $location, $rootScope, http, $mdDialog) {


// AIzaSyDuieRZKkDUZG01JMtPGZ5532OVRfStjzw

        var self = this;

        (function() {

            
            $scope.user = localData.data();
            $scope.user.dob = new Date($scope.user.dob);
            $scope.dobMaxDate = new Date();

            $timeout(function(){
                $scope.stateChanged();
            }, 1000);

            if ($scope.user.image) {
                $scope.imagePath = $scope.user.image;
            } else {
                $scope.imagePath = "assets/img/frontend/camra-icon.png";
            }

            $scope.statesArray = australia.states();


        }());




        $scope.oneAtATime = true;

        $scope.groups = [{
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
            },
            {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }
        ];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.leaveReviewPopup = function(ev) {
            $mdDialog.show({
                    controller: "includesCtrl",
                    templateUrl: 'frontend/popup/leave_review.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };



        $scope.updateProfile = function() {

            var data = angular.copy($scope.user);
            var removalData = ['country_code', 'updated_at', "created_at"];

            removalData.forEach(function(key) {
                delete data[key];
            });

            data.subrub = data.subrub.display;
            http.post('/update-user-profile', data).then(function(response) {

                toastyService.notification(response.result, response.message);
                if (response.result) {
                    localData.setUser($scope.user);
                }
            });
        };




        $scope.myImage = '';
        $scope.myCroppedImage = '';

        $scope.selectFile = function(file, isShow) {

            var allowed_image_extensions = ['image/jpeg', 'image/jpg', 'image/png'];
            if (file && allowed_image_extensions.indexOf(file.type) === -1) {
                toastyService.notification(false, "You can only upload image having file extension jpg, jpeg or png");
                return;
            }

            self.filename = (file) ? file.name : '';
            var reader = new FileReader();
            reader.onload = function(evt) {
                $scope.$apply(function($scope) {
                    $scope.myImage = evt.target.result;
                    if (isShow) {
                        $scope.cropImagePopup();
                    }

                });
            };

            reader.readAsDataURL(file);

        };


        $scope.uploadProfileImage = function(image, name) {

            var img = {
                dataUrl: image,
                imageName: self.filename
            };
            Upload.upload({
                url: 'update-user-profile-image',
                data: {
                    file: Upload.dataUrltoBlob(img.dataUrl, img.imageName)
                }
            }).then(function(response) {

                toastyService.notification(response.data.success, response.data.message);
                $scope.closeImageDialog();

                if (response.data.success) {
                    $scope.imagePath = response.data.url;
                    $scope.user.image = $scope.imagePath;
                    localData.setUser($scope.user);
                    $rootScope.$emit('callIncludesCtrl', $scope.imagePath);
                }

            });
        };


        $scope.cropImagePopup = function() {
            $mdDialog.show({
                contentElement: '#imageDialog',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        };

        $scope.closeImageDialog = function() {
            $scope.myImage = '';
            $mdDialog.hide();
        };

        

        $scope.stateChanged = function () {

            http.get('/get-suburb-list?state='+$scope.user.state).then(function(response){
                self.suburbListArray = response.record.data;
                self.states = loadAll();
            });

        };


        $scope.querySearch = function(query) {

            var results = query ? self.states.filter(createFilterFor(query)) : self.states,
                deferred;

            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function() {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        };

        $scope.searchTextChange = function(text) {

            
        };

        function loadAll() {

            var allStates = self.suburbListArray;
            return allStates.map(function(state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });

        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };

        }

    }
]);