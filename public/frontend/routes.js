'use strict';

app.config(['$routeProvider', '$locationProvider',  function($routeProvider, $locationProvider) {

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
            .when('/search-listing', {
                templateUrl: 'frontend/search/views/search_listing.html',
                controller: "searchCtrl",
                resolve: {
                    validate: required
                }                  
            })
            .when('/my-profile', {
                templateUrl: 'frontend/profile/views/my_profile.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            })
            .when('/settings', {
                templateUrl: 'frontend/settings/views/settings.html',
                controller: "settingsCtrl",
                resolve: {
                    validate: required
                }                  
            }) 
            .when('/refer-to-friend', {
                templateUrl: 'frontend/refer/views/refer.html',
                controller: "referCtrl",
                resolve: {
                    validate: required
                }                  
            })
            .when('/document-verification', {
                templateUrl: 'frontend/profile/views/dash_verification.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            })            

            .when('/my-booking', {
                templateUrl: 'frontend/profile/views/dash_booking.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            }) 

            .when('/transaction', {
                templateUrl: 'frontend/profile/views/dash_transaction.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            })
            .when('/messages', {
                templateUrl: 'frontend/profile/views/dash_message.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            }) 
            .when('/reviews', {
                templateUrl: 'frontend/profile/views/dash_reviews.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            }) 
            .when('/dash-services', {
                templateUrl: 'frontend/profile/views/dash_services.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            })
            .when('/dash-payment-preferences', {
                templateUrl: 'frontend/profile/views/dash_payment_preferences.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            })  
            .when('/dash-booking-summary', {
                templateUrl: 'frontend/profile/views/dash_booking_summary.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            })   
            .when('/about-us', {
                templateUrl: 'frontend/cms/views/about_us.html',
                controller: "cmsCtrl"              
            })
            .when('/how-it-works', {
                templateUrl: 'frontend/cms/views/howit_works.html',
                controller: "cmsCtrl"                
            })      

            .otherwise({
                redirectTo: '/'
            });

            // $locationProvider.html5Mode(true);
    }]);



var required = ['$q', function  ($q) {
    var deferred = $q.defer();
    var token = localStorage.getItem("t");
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
    var token = localStorage.getItem("t");
    if (token) {
        deferred.reject({
            authentication: true
        });
    } else {
        deferred.resolve();
    }
    return deferred.promise;
}];