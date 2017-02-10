app.controller('profileController', ['Upload', '$routeParams', '$scope', '$rootScope', '$location', '$http', 'toasty', 'toastyService',
   
    function(Upload, $routeParams, $scope, $rootScope, $location, $http, toasty, toastyService) {
          $scope.adminProfileInfo = function() {
            $http.get('/admin/profile-info').success(function(response) {
                $scope.user = response.info;
            });
        };
       
    }
]);