app.controller('profileController', ['Upload', '$routeParams', '$scope', '$rootScope', '$location', '$http', 'toasty', 'toastyService',
   
    function(Upload, $routeParams, $scope, $rootScope, $location, $http, toasty, toastyService) {
          
        (function(){
            adminProfileInfo();
        }());     

        function adminProfileInfo() {
            $http.get('/admin/profile-info').then(function(response) {
                $scope.user = response.data.info;
            });
        }

      $scope.editProfilePage = function (url) {
        $location.path('/admin/edit-profile');
      };

        $scope.updateAdminProfile = function(user) {
            $http.post('/admin/update-profile', user).then(function(response) {

                toastyService.notification(response.data.success, response.data.msg);
                if (response.data.success) {
                	$location.path('/admin/profile');
                }
            });
        };   
        $scope.changePassword = function(p) {

            var obj = {
                currentPassword: p.current,
                password: p.cpassword,
                _id: $scope.user._id
            };
            if (p.cpassword == p.password) {
                $http.post('/admin/changePassword', obj).then(function(response) {
                    toastyService.notification(response.data.success, response.data.msg);
                });
            } else {
                toastyService.notification(false, "New password and confirm password is not equal.");
            }
        };             
       
    }
]);