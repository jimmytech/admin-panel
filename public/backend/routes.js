'use strict';

app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'view/admin/home.html',
                controller: 'homeController',
                resolve: {
                    validate: notRequired
                }
            })
            .when('/admin/login', {
                templateUrl: 'backend/landing/views/admin_login.html',
                controller: 'authController',
                resolve: {
                    validate: notRequired
                }
            })            
            .when('/admin/dashboard', {
                templateUrl: 'backend/home/views/admin_dashboard.html',
                controller: 'homeController',
                resolve: {
                    validate: required
                }
            })

            .when('/admin/posts', {
                templateUrl: 'backend/blog/views/blog.html',
                controller: 'blogController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/post/:key', {
                templateUrl: 'backend/blog/views/add_edit_blog.html',
                controller: 'blogController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/view-post-info/:id', {
                templateUrl: 'backend/blog/views/blog_detail.html',
                controller: 'blogController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/pages', {
                templateUrl: 'backend/cms/views/cms.html',
                controller: 'cmsController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/pages/:page', {
                templateUrl: 'backend/cms/views/add_edit_page.html',
                controller: 'cmsController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/page/detail/:id', {
                templateUrl: 'backend/cms/views/cms_page_detail.html',
                controller: 'cmsController',
                resolve: {
                    validate: required
                }
            })

            .when('/admin/profile', {
                templateUrl: 'backend/profile/views/profile.html',
                controller: 'profileController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/edit-profile', {
                templateUrl: 'backend/profile/views/edit_profile.html',
                controller: 'profileController',
                resolve: {
                    validate: required
                }
            })            
            .when('/admin/change-password', {
                templateUrl: 'backend/profile/views/change_password.html',
                controller: 'profileController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/faq', {
                templateUrl: 'backend/faq/views/faq.html',
                controller: 'faqController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/faq/:u', {
                templateUrl: 'backend/faq/views/add_edit_faq.html',
                controller: 'faqController',
                resolve: {
                    validate: required
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
                if (path == '/admin/login') {
                    $rootScope.headerAndSidebar = true;
                } else {
                    $rootScope.headerAndSidebar = false;
                }
            });
            $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
                if (rejection.authentication === true) {
                    $location.path('/admin/dashboard');
                } else {
                    $location.path('/admin/login');
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
    var token = localStorage.getItem("token");
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
    var token = localStorage.getItem("token");
    if (token) {
        deferred.reject({
            authentication: true
        });
    } else {
        deferred.resolve();
    }
    return deferred.promise;
}];