// routes
app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            controller: 'adminCtrl',
            templateUrl: 'assets/admin/templates/login.html',
            access:{requiredLogin: false},
            resolve: {
            	validate: checkAuthencationBeforeLogin
            }
        }).when('/dashboard', {
            controller: 'dashboardCtrl',
            templateUrl: 'assets/admin/templates/dashboard.html',
            access:{requiredLogin: true},
            resolve: {
                validate: checkAuthencation
            }
        }).when('/users/:type', {
            controller: 'userManagementCtrl',
            templateUrl: 'assets/admin/partials/user/user_list.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/users/new/signup', {
            controller: 'userManagementCtrl',
            templateUrl: 'assets/admin/partials/user/new_user.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/users/:role/edit/:id', {
            controller: 'userManagementCtrl',
            templateUrl: 'assets/admin/partials/user/edit_user_detail.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/users/:role/view/:id', {
            controller: 'userManagementCtrl',
            templateUrl: 'assets/admin/partials/user/view_user_detail.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/my-profile', {
            controller: 'userManagementCtrl',
            templateUrl: 'assets/admin/partials/user/adminProfile.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/my-profile/change-password', {
            controller: 'userManagementCtrl',
            templateUrl: 'assets/admin/partials/user/adminProfile.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/additional-exclusion', {
            controller: 'additionalExclusionCtrl',
            templateUrl: 'assets/admin/partials/property/additional_exclusion/additional_exclusion.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/additional-exclusion/new', {
            controller: 'additionalExclusionCtrl',
            templateUrl: 'assets/admin/partials/property/additional_exclusion/new_additional_exclusion.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/additional-exclusion/edit/:id', {
            controller: 'additionalExclusionCtrl',
            templateUrl: 'assets/admin/partials/property/additional_exclusion/edit_additional_exclusion.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/additional-feature', {
            controller: 'additionalFeatureCtrl',
            templateUrl: 'assets/admin/partials/property/additional_feature/additional_frature.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/additional-feature/new', {
            controller: 'additionalFeatureCtrl',
            templateUrl: 'assets/admin/partials/property/additional_feature/new_additional_feature.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/additional-feature/edit/:id', {
            controller: 'additionalFeatureCtrl',
            templateUrl: 'assets/admin/partials/property/additional_feature/edit_additional_feature.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/subscription-plan/:plan', {
            controller: 'planManagementCtrl as plan',
            templateUrl: 'assets/admin/partials/subscription_plan/subscriptionPlanManagement.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/subscription-plan/add/:type', {
            controller: 'planManagementCtrl as plan',
            templateUrl: 'assets/admin/partials/subscription_plan/addEditSubscriptionPlan.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }) .when('/property-management/view-property/:type', {
            controller: 'propertyManagementCtrl',
            templateUrl: 'assets/admin/partials/property/property_management.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/edit/:slug', {
            controller: 'propertyManagementCtrl',
            templateUrl: 'assets/admin/partials/property/edit_property.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }) .when('/property-management/new-property/for', {
            controller: 'propertyManagementCtrl',
            templateUrl: 'assets/admin/partials/property/property_upload_selection.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }) .when('/property-management/new-property/for/me', {
            controller: 'propertyManagementCtrl',
            templateUrl: 'assets/admin/partials/property/upload_new_property.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }) .when('/property-management/new-property/for/others', {
            controller: 'propertyManagementCtrl',
            templateUrl: 'assets/admin/partials/property/select_user.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }) .when('/property-management/new-property/for/other/:id', {
            controller: 'propertyManagementCtrl',
            templateUrl: 'assets/admin/partials/property/upload_new_property.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/option', {
            controller: 'propertyOptionCtl',
            templateUrl: 'assets/admin/partials/property/property_type/property_type.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/option/new/:type', {
            controller: 'propertyOptionCtl',
            templateUrl: 'assets/admin/partials/property/property_type/new_property_type.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/property-management/option/edit/:type/:id', {
            controller: 'propertyOptionCtl',
            templateUrl: 'assets/admin/partials/property/property_type/edit_property_type.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/subscription-plan/edit/:type/:id', {
            controller: 'planManagementCtrl as plan',
            templateUrl: 'assets/admin/partials/subscription_plan/addEditSubscriptionPlan.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/franchisee-management/request', {
            controller: 'franchiseeManagementCtrl',
            templateUrl: 'assets/admin/partials/franchisee/franchisee_request.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/franchisee-management/select-post-code', {
            controller: 'franchiseeManagementCtrl',
            templateUrl: 'assets/admin/partials/franchisee/assign_postcode.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/franchisee-management/new/select-post-code', {
            controller: 'franchiseeManagementCtrl',
            templateUrl: 'assets/admin/partials/franchisee/assign_postcode.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/franchisee-management/request/view/:id', {
            controller: 'franchiseeManagementCtrl',
            templateUrl: 'assets/admin/partials/franchisee/view_franchisee_detail.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/franchisee-management/request/edit/:id', {
            controller: 'franchiseeManagementCtrl',
            templateUrl: 'assets/admin/partials/franchisee/edit_franchisee_request.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/franchisee-management/new-franchisee', {
            controller: 'franchiseeManagementCtrl',
            templateUrl: 'assets/admin/partials/franchisee/new_franchise.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        }).when('/professional-traders/service-request', {
            controller: 'professionalTradersCtrl',
            templateUrl: 'assets/admin/partials/professional-traders/service_request.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        })
        .when('/professional-traders/registration', {
            controller: 'professionalTradersCtrl',
            templateUrl: 'assets/admin/partials/professional-traders/new_professional_traders.html',
            access: {
                requiredLogin: true
            },
            resolve: {
                validate: checkAuthencation
            }
        })
        .when('/generate-password/:token', {
            controller: 'userManagementCtrl',
            templateUrl: 'assets/admin/partials/franchisee/franchisee.html',
            access:{requiredLogin: false}
        })
        .when('/sendgrid-mail-queue', {
            controller: 'mailActivitiesCtrl',
            templateUrl: 'assets/admin/partials/mail-queue/sendgrid-mail-queue.html',
            access:{requiredLogin: true}
        })
        .when('/cron-mail-queue', {
            controller: 'cronMailCtrl',
            templateUrl: 'assets/admin/partials/mail-queue/cron-mail-queue.html',
            access:{requiredLogin: true}
        })
        .otherwise({
            redirectTo: '/'
        });
    }])
    .config(['$timepickerProvider', function($timepickerProvider) {
        angular.extend($timepickerProvider.defaults, {
            timeFormat: 'HH:mm',
            iconUp: 'md md-expand-less',
            iconDown: 'md md-expand-more',
            hourStep: 1,
            minuteStep: 1,
            arrowBehavior: 'picker',
            modelTimeFormat: 'HH:mm'
        });
    }])
    // disable nganimate with adding class
    .config(['$animateProvider', function($animateProvider) {
        $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
    }])
    // // set constants
    .config(['$httpProvider', function($httpProvider) {
        var interceptor = ['$q', 'localStorageService', '$location', function($q, localStorageService, $location) {
            /* Get the application storage type default (localstorage) */
            // var storageType = localStorageService.get('staySignedIn');
            return {
                request: function(config) {
                    config.headers = config.headers || {};
                     var token = localStorage.getItem("token");
                    if (token) {
                        config.headers.Authorization = 'Bearer ' + token;
                    }
                    return config;
                },
                requestError: function(rejection) {
                    return $q.reject(rejection);
                },
                response: function(response) {
                    return response || $q.when(response);
                },
                // Revoke client authentication if 400 is received
                responseError: function(rejection) {
                    if (rejection !== null && rejection.status === 400) {
                        // localStorageService.remove('token', 'localStorage');
                        // localStorageService.remove('admin:user', 'localStorage');
                        // AuthSrv.isLogged = false;
                        // $location.path("/login");
                    }
                    return $q.reject(rejection);
                }
            };
        }];
        $httpProvider.interceptors.push(interceptor);
    }])

    .run(['$rootScope', '$location',
        function($rootScope, $location) {
            $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
                if (rejection.authentication===false) {
                    $location.path('/');
                }else{
                    $location.path('/dashboard');
                }

            });
            $rootScope.$on('$routeChangeSuccess', function() {
                var when = $location.path().split("/")[1];
                if($location.path()=='/' || when == 'generate-password'){
                    $rootScope.header = false;
                }else{
                    $rootScope.header = true;
                }
            });
        }
    ]);

var checkAuthencation = function($q) {
    var deferred = $q.defer();
    if (!localStorage.getItem("user")) {
        deferred.reject({
            authentication: false
        });
    } else {
        deferred.resolve();
    }
    return deferred.promise;
};

var checkAuthencationBeforeLogin = function($q){
    var deferred = $q.defer();
    if (!localStorage.getItem("user")) {
        deferred.resolve();
    } else {
        deferred.reject({
            authentication: true
        });
    }
    return deferred.promise;
};
