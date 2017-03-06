'use strict';

app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'frontend/landing/views/landing.html',
                controller: 'landingCtrl',
                resolve: {
                    validate: notRequired
                }
            })
            .when('/home', {
                templateUrl: 'frontend/home/views/home.html',
                resolve: {
                    validate: notRequired
                }
            })

            .otherwise({
                redirectTo: '/'
            });
    }])
    .config(['toastyConfigProvider', function(toastyConfigProvider) {
        toastyConfigProvider.setConfig({
            sound: true,
            shake: false,
            position: 'top-right'
        });
    }])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(['$q', function($q) {
                  return {
                   'request': function(config) {
                        config.headers = config.headers || {};
                        var token = localStorage.getItem("token");
                        if(token){
                            config.headers.Authorization = 'Bearer ' + token;
                        }
                       return config || $q.when(config);
                    },
                    'response': function(response) {
                       return response || $q.when(response);
                    }
                  };
                }]);
    }])     
    .run(['$rootScope', '$location',
        function($rootScope, $location) {
            $rootScope.$on('$routeChangeSuccess', function() {
                var path = $location.path();
                if (path == '/') {
                    $rootScope.headerAndSidebar = true;
                } else {
                    $rootScope.headerAndSidebar = false;
                }
            });
            $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
                if (rejection.authentication === true) {
                    $location.path('home');
                } else {
                    $location.path('/');
                }

            });
            $rootScope.$on('$routeChangeStart', function() {
                if ($location.path() == '/admin/login') {
                    $rootScope.adminLoginPage = true;
                } else {
                    $rootScope.adminLoginPage = false;
                }
            });          
        }
    ]);


var required = ['$q', function  ($q) {
    var deferred = $q.defer();
    var token = localStorage.getItem("userToken");
    if (token) {
        deferred.resolve();
    } else {
        deferred.reject({
            authentication: false
        });
    }
    return deferred.promise;
}];

var notRequired = ['$q', function  ($q) {
    var deferred = $q.defer();
    var token = localStorage.getItem("userToken");
    if (token) {
        deferred.reject({
            authentication: true
        });
    } else {
        deferred.resolve();
    }
    return deferred.promise;
}];