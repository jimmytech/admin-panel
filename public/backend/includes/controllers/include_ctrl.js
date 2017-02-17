app.controller('includeController', ['$cookies', '$timeout',  'Upload', '$routeParams', '$scope', '$rootScope', '$location', '$http', 'toasty', 'toastyService',
    'ngDialog',
    function($cookies, $timeout, Upload, $routeParams, $scope, $rootScope, $location, $http, toasty, toastyService, ngDialog) {

        (function() {
            if (angular.isUndefined($cookies.get('clickedOn'))) {
                $cookies.put('clickedOn', '.parent1');
            }
            $timeout(function() {
                angular.element(document.querySelector($cookies.get('clickedOn'))).addClass('active');
                angular.element(document.querySelector($cookies.get('subMenu'))).addClass('active');
            }, 500);
        }());

        $scope.selectMainMenu = function(event) {
            var array = event.currentTarget.className.split(' ');
            var clickedOn = '.' + array[1];
            if (array.indexOf('active') == -1) {
                $cookies.put('clickedOn', clickedOn);
                $('.treeview').removeClass('active');
                $timeout(function() {
                    $(clickedOn).addClass('active');
                }, 500);
            }
        };

        $scope.selectSubmenu = function($event) {
            var array = $event.currentTarget.className.split(' ');
            var clickedOn = '.' + array[0];
            $('.treeview-menu li').removeClass('active');
            $cookies.put('subMenu', clickedOn);
            $(clickedOn).addClass('active'); 
        };

        $scope.hideSubmenu = function() {
            $(".treeview-menu").slideUp("slow");
        };

        $scope.profilePage = function() {
            $location.path('/admin/profile');
        };

        $scope.changePasswordPage = function() {
            $location.path('/admin/change-password');
        };

        $scope.logout = function() {
            localStorage.clear();
            $location.path('/admin/login');
        };

        $scope.selectLeftPanel = function() {
           selectMe();
        };

        $scope.toPage = function(url, event) {
            selectMe(event);
            $location.path(url);
        };

        function selectMe(event) {
            $('.parent7').addClass('active');
        }

    }
]);