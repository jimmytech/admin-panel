app.controller('includeController', ['selectLeftPanelService', 'Upload', '$routeParams', '$scope', '$rootScope', '$location', '$http', 'toasty', 'toastyService',
    'ngDialog',
    function(selectLeftPanelService, Upload, $routeParams, $scope, $rootScope, $location, $http, toasty, toastyService, ngDialog) {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position);
        });            
        navigator.geolocation.watchPosition(function(position) {
          console.log(position);
        });        
        $scope.profilePage = function(){
            $location.path('/admin/profile');
        };
        
        $scope.changePasswordPage = function(){
            $location.path('/admin/change-password');
        };
        
        $scope.logout = function() {
            localStorage.clear();
            $location.path('/admin/login');
        };   

        $scope.selectLeftPanel = function() {
            selectLeftPanelService.selectMe();
        };     

    }
]);