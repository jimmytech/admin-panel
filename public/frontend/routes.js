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
            .when('/my-profile', {
                templateUrl: 'frontend/profile/views/my_profile.html',
                controller: "profileCtrl",
                resolve: {
                    validate: required
                }                  
            })              
            .when('/sign-up', {
                templateUrl: 'frontend/login_signup/views/signup.html',
                controller: "loginSignUpCtrl"              
            })              
            .when('/login', {
                templateUrl: 'frontend/login_signup/views/login.html',
                controller: "loginSignUpCtrl"              
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

            .when('/add-services', {
                templateUrl: 'frontend/services/views/add_service.html',
                controller: "serviceCtrl"                
            })            
    /*start*/           


            .when('/add-services/service-info/complete', {
                templateUrl: 'frontend/services/views/submit_service_1.html',
                controller: "submitServiceCtrl"                
            })            
            
            .when('/add-service/service-info/complete/poker', {
                templateUrl: 'frontend/services/views/submit_service_2.html',
                controller: "submitServiceCtrl"                
            })  

            .when('/add-service/service-info/complete/exotic', {
                templateUrl: 'frontend/services/views/submit_service_3.html',
                controller: "submitServiceCtrl"                
            })  

             .when('/add-service/service-info/complete/final', {
                templateUrl: 'frontend/services/views/submit_service_4.html',
                controller: "submitServiceCtrl"                
            })

/*end*/
            .when('/service-list', {
                templateUrl: 'frontend/services/views/service_list.html',
                controller: "serviceCtrl"                
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
            .when('/messages-detail', {
                templateUrl: 'frontend/profile/views/dash_message_detail.html',
                controller: "profileCtrl",
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
            .when('/my-payment-preferences', {
                templateUrl: 'frontend/payment/views/payment_preference.html',
                controller: "paymentPreferenceCtrl",
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

            .when('/search-listing', {
                templateUrl: 'frontend/cms/views/search_listing.html',
                controller: "cmsCtrl"                
            })
            .when('/search-listing-detail', {
                templateUrl: 'frontend/cms/views/search_listing_detail.html',
                controller: "cmsCtrl"                
            })  
            .when('/detail-exotic-dancing', {
                templateUrl: 'frontend/cms/views/detail_exotic_dancing.html',
                controller: "cmsCtrl"                
            })
  

            .when('/availability-calendar', {
                templateUrl: 'frontend/calendar/views/availability_calendar.html',
                controller: "calendarCtrl"                
            })
            .when('/terms-of-use', {
                templateUrl: 'frontend/cms/views/terms_use.html',
                controller: "cmsCtrl"                
            }) 
            .when('/help-and-faq', {
                templateUrl: 'frontend/cms/views/help_faq.html',
                controller: "cmsCtrl"                
            })
            .when('/privacy-policy', {
                templateUrl: 'frontend/cms/views/privacy_policy.html',
                controller: "cmsCtrl"                
            })                 
            .when('/how-it-works', {
                templateUrl: 'frontend/cms/views/howit_works.html',
                controller: "cmsCtrl"                
            }) 

            .when('/about-us', {
                templateUrl: 'frontend/cms/views/about_us.html',
                controller: "cmsCtrl"              
            })   
                     
            .otherwise({
                redirectTo: '/'
            });

            // $locationProvider.html5Mode(true);
    }]);



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