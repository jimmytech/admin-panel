'use strict';

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'backend/landing/views/admin_login.html',
                controller: 'authController',
                resolve: {
                    validate: notRequired
                }
            })          
            .when('/admin/dashboard', {
                templateUrl: 'backend/dashboard/views/admin_dashboard.html',
                controller: 'dashCtrl',
                // reloadOnSearch: false,
                resolve: {
                    validate: required
                }
            })

            .when('/admin/posts', {
                templateUrl: 'backend/blog/views/blog.html',
                reloadOnSearch: false,
                controller: 'blogController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/edit-post/:id', {
                templateUrl: 'backend/blog/views/add_edit_blog.html',
                controller: 'editBlogController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/view-post/:id', {
                templateUrl: 'backend/blog/views/blog_detail.html',
                controller: 'previewBlogController',
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
                controller: 'addEditCmsController',
                resolve: {
                    validate: required
                }
            })
            .when('/admin/page/detail/:page', {
                templateUrl: 'backend/cms/views/cms_page_detail.html',
                controller: 'addEditCmsController',
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
                controller: 'addEditFaqController',
                resolve: {
                    validate: required
                }
            })            
            .when('/admin/view-faq/:u', {
                templateUrl: 'backend/faq/views/faq_detail.html',
                controller: 'addEditFaqController',
                resolve: {
                    validate: required
                }
            })            
            .when('/admin/Categories', {
                templateUrl: 'backend/Categories/views/categories.html',
                controller: 'categoryController',
                resolve: {
                    validate: required
                }
            })            
            .when('/admin/categories/new-category', {
                templateUrl: 'backend/Categories/views/add_edit_category.html',
                controller: 'addEditCategoryController',
                resolve: {
                    validate: required
                }
            })             
            .when('/admin/category/:id', {
                templateUrl: 'backend/Categories/views/add_edit_category.html',
                controller: 'addEditCategoryController',
                resolve: {
                    validate: required
                }
            })               
            .when('/admin/category/detail/:id', {
                templateUrl: 'backend/Categories/views/preview_category.html',
                controller: 'addEditCategoryController',
                resolve: {
                    validate: required
                }
            })            
            .when('/admin/users', {
                templateUrl: 'backend/users/views/users.html',
                reloadOnSearch: false,
                controller: 'userController',
                resolve: {
                    validate: required
                }
            })                      
            .when('/admin/users/new', {
                templateUrl: 'backend/users/views/new_user.html',
                controller: 'addEditUserCtrl',
                resolve: {
                    validate: required
                }
            })            
            .when('/admin/user/account/:id', {
                templateUrl: 'backend/users/views/edit_user.html',
                controller: 'addEditUserCtrl',
                resolve: {
                    validate: required
                }
            })
            .otherwise({
                redirectTo: '/'
            });

            // $locationProvider.html5Mode(true);
    }]);

app

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

    .config(['toastyConfigProvider', function(toastyConfigProvider) {
        toastyConfigProvider.setConfig({
            sound: true,
            shake: false,
            position: 'top-right'
        });
    }])
        
    .run(['$rootScope', '$location',
        function($rootScope, $location) {
            $rootScope.$on('$routeChangeSuccess', function() {
                if ($location.path() == '/admin/login' || $location.path() == '/') {
                    $rootScope.headerAndSidebar = false;
                } else {
                    $rootScope.headerAndSidebar = true;
                }

            });

            $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {

                if (rejection.authentication === true) {
                    $location.path('/admin/dashboard');
                } else {
                    $location.path('/admin/login');
                }

            });

            $rootScope.$on('$locationChangeSuccess', function(event, current, previous) {
                
                var previousUrl = previous.substr(0, previous.indexOf('?'));
                var currentUrl = current.substr(0, current.indexOf('?'));

                if (previousUrl !== currentUrl && previousUrl.length > 0) {
                    $location.search('');
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