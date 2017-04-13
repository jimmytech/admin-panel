"use strict";
app.controller('adminCtrl', ['$scope', '$http', '$rootScope', '$location', 'AlertService', 'userManagementService',  function($scope, $http, $rootScope, $location, AlertService, userManagementService) {
    $scope.person = {};
    $scope.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];
    $scope.selectedState = '';
    $scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
    $scope.sharedDate = '01/01/2016';
    $scope.sharedTime = "1970-01-01T09:30:40.000Z";   
    $rootScope.headerFooter = false; 
    $scope.adminLogin = function() {
        $http.post('/admin/login', $scope.user).then(function(response) {
            if (response.data.error) {
                $scope.error = response.data.error;
                AlertService.popUp({
                    title: "Error!",
                    message: $scope.error.message,
                    type: 'danger'
                });
            } else {
                var userObj = {
                    user: response.data.user,
                    key: response.data.key
                };
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(userObj));
                $location.path('/dashboard');
            }
        });
    };
   
}]);