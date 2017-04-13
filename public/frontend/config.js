'use strict';

app
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
                    $location.path('/my-profile');
                } else {
                    $location.path('/');
                }

            });
            $rootScope.$on('$routeChangeStart', function() {
                var links = ['/how-it-works', '/about-us', '/search-listing', '/search-listing-detail', '/help-and-faq', '/privacy-policy', '/terms-of-use','/detail-exotic-dancing', '/sign-up', '/login'];
                if ($location.path() == '/' || links.indexOf($location.path()) >= 0) {
                    $rootScope.homePage = true;
                } else {
                    $rootScope.homePage = false;
                }

                // if (links.indexOf($location.path()) >= 0) {
                //     console.log("yes");
                //     $rootScope.homePage = true;
                // }else{
                //     console.log("no");
                // }
            });          
        }
    ])

    .config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD-MM-YYYY');
        };

    }])

    .config(['toastyConfigProvider', function(toastyConfigProvider) {
        toastyConfigProvider.setConfig({
            // sound: true,
            shake: false,
            position: 'top-center'
        });
    }])
    
    .config(['$httpProvider', function($httpProvider) {

        $httpProvider.interceptors.push(['$q', function($q) {
            return {
                'request': function(config) {
                    config.headers = config.headers || {};
                    var token = localStorage.getItem("userToken");
                    if (token) {
                        config.headers.Authorization = 'Bearer ' + token;
                    }
                    return config || $q.when(config);
                },
                'response': function(response) {
                    return response || $q.when(response);
                }
            };
        }]);
    }]);