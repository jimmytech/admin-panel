app.controller('dashboardCtrl', ['$scope', '$http', '$location', '$animate', 'localStorageService', 'todoService', '$alert', '$timeout', '$rootScope',
    function($scope, $http, $location, $animate, localStorageService, todoService, $alert, $timeout, $rootScope) {
        $scope.theme_colors = ['pink', 'red', 'purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange'];
        service = new todoService($scope);        
        $scope.todosCount = service.count();
        $scope.$on('todos:count', function(event, count) {
            $scope.todosCount = count;
            element = angular.element('#todosCount');
            if (!element.hasClass('animated')) {
                $animate.addClass(element, 'animated bounce', function() {
                    $animate.removeClass(element, 'animated bounce');
                });
            }
        });
        $scope.fillinContent = function() {
            $scope.htmlContent = 'content content';
        };
        // theme changing
        $scope.changeColorTheme = function(cls) {
            $rootScope.$broadcast('theme:change', 'Choose template'); //@grep dev
            $scope.theme.color = cls;
        };
        $scope.changeTemplateTheme = function(cls) {
            $rootScope.$broadcast('theme:change', 'Choose color'); //@grep dev
            $scope.theme.template = cls;
        };
        if (!localStorageService.get('theme')) {
            theme = {
                color: 'theme-pink',
                template: 'theme-template-dark'
            };
            localStorageService.set('theme', theme);
        }
        localStorageService.bind($scope, 'theme');

        if (!localStorageService.get('alert-introduction')) {
            $timeout(function() {
                $scope.showIntroduction();
                localStorageService.set('alert-introduction', 1);
            }, 2500);
        }
        $scope.showIntroduction = function() {
            // introductionAlert.show();
        };
        var refererNotThemeforest = $alert({
            title: 'Hi there!',
            content: 'You like what you see and interested in using our theme? You can find it at <a href="http://themeforest.net/item/materialism-angular-bootstrap-admin-template/11322821" target="_blank"><img style="height:20px;" src="images/themeforest-icon.png" /> Themeforest</a>.',
            placement: 'top-right',
            type: 'theme',
            container: '.alert-container-top-right',
            show: false,
            animation: 'mat-grow-top-right'
        });
        if (document.referrer === '' || document.referrer.indexOf('themeforest.net') !== 0) {
            $timeout(function() {
                refererNotThemeforest.show();
            }, 1750);
        }
        $scope.adminLogin = function(data) {
            $http.post('/admin/login', data).success(function(response) {
                if (response.success === true) {
                    $location.path('/admin/dashboard');
                }
            });
        };
        $scope.userList = function(type) {
            $location.path('/userlist');
            // $http.get('/admin/getUserList?key='+type).success(function(response){
            //  }) 
        };
    }
]);