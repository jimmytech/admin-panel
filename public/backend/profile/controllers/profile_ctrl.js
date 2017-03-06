app.controller('profileController', ['socket', 'Upload', '$routeParams', '$scope', '$rootScope', '$location', '$http', 'toasty', 'toastyService',
   
    function(socket, Upload, $routeParams, $scope, $rootScope, $location, $http, toasty, toastyService) {
          
       
            
          $scope.editProfilePage = function (url) {
          	$location.path('/admin/edit-profile');
          };
          $scope.adminProfileInfo = function() {
            $http.get('/admin/profile-info').then(function(response) {
                $scope.user = response.data.info;
            });
        };
        $scope.updateAdminProfile = function(user) {
            $http.post('/admin//update-profile', user).then(function(response) {
                toastyService.notification(response.data.success, response.data.msg);
                if (response.data.success) {
                	$location.path('/admin/profile');
                }
            });
        };   
        $scope.changePassword = function(p) {
            var obj = {
                password: p.cpassword
            };
            if (p.cpassword == p.password) {
                $http.post('/admin/changePassword', obj).success(function(response) {
                    toastyService.notification(response.success, response.msg);
                });
            } else {
                toastyService.notification(false, "New password and confirm password is not equal.");
            }
        };             
       
    }
]);