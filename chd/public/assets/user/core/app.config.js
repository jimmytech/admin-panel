'use strict';

/* Application level configuration file */
angular.module('app.config', ['LocalStorageModule'])

/*Angular interceptors are service factories that are registered with the $httpProvider */
.config(['$httpProvider', function($httpProvider){
	var interceptor = ['$q', 'localStorageService', 'AuthSrv', '$location','$rootScope', 'POSTCODE','$log',function ($q, localStorageService, AuthSrv, $location,$rootScope, POSTCODE, $log) {

		/* Get the application storage type default (localstorage) */
		var storageType = localStorageService.get('staySignedIn');
        // $log.debug("Config storage type ", storageType);
        return {
        	request: function (config) {
	           	config.headers = config.headers || {};
	           	var token = localStorageService.get('token', storageType);
                
	           	if (token) {
                    // $log.debug("Config token ", !angular.isUndefined(token));
	               	config.headers.Authorization = 'Bearer '+ token;
	               	AuthSrv.isLogged = 1;
	           	}
	           	return config;
	       	},

            requestError: function (rejection) {
                return $q.reject(rejection);
            },

            response: function (response) {
                return response || $q.when(response);
            },

            // Revoke client authentication if 400 is received
            responseError: function (rejection) {
                if(rejection.status === 401 && rejection.data.errors.code !== undefined){
                    $rootScope.$broadcast( 'TokenExpiredError', { message: 'Session has been expired, please login again.' } );
                    localStorageService.remove('staySignedIn','localStorage');
                    localStorageService.remove('token', storageType);
                    localStorageService.remove('user', storageType);
                    delete $rootScope.user;
                    AuthSrv.isLogged = false;
                    $location.path("/login");
                }
                return $q.reject(rejection);
            }
        };
    }];

	$httpProvider.interceptors.push(interceptor);
}])
.config(['$mdThemingProvider','$mdDateLocaleProvider', function($mdThemingProvider, $mdDateLocaleProvider){
	$mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('blue');

    $mdThemingProvider.enableBrowserColor({
      theme: 'blue', // Default is 'default'
      palette: 'blue', // Default is 'primary', any basic material palette and extended palettes are available
      hue: '800' // Default is '800'
    });

    $mdDateLocaleProvider.formatDate = function(date) {
        // Set the date format for entire datepickers
       return !angular.isUndefined(date) ? moment(date).format('DD/MM/YYYY') : '';
    };
    
}])
.config(['localStorageServiceProvider',function(localStorageServiceProvider){
    var port = window.location.port;
    var prefix;
    switch(port){
        case '9000' || 9000: 
        prefix = 'dev';
        break;

        case '9001' || 9001:
        prefix = 'qa';
        break;

        case '9002' || 9001:
        prefix = 'uat';
        break;

        default:
        prefix = 'local';
    }
    localStorageServiceProvider.setPrefix(prefix);
}])
.constant("POSTCODE", {
    "API_KEY": "ak_ius21ypnuBLfEO95IfdZpB5WeNEJ6",
    "API_URL": "https://api.ideal-postcodes.co.uk/"
})
.constant("GOOGLEMAP", {
    "API_KEY": "AIzaSyAOv3L4ppIKkwOPBa2bohfJqjqiWkuLODk",
    "API_URL": "https://maps.googleapis.com/maps/api/js"
})
.run(['$location','$rootScope', 'localStorageService', 'AuthSrv', 'CommanSrv','toastService','$mdSidenav','$timeout',
	function($location, $rootScope, localStorageService, AuthSrv, CommanSrv, toastService, $mdSidenav, $timeout){
        $rootScope.filterSpinner = true; 
        $rootScope.$on("$includeContentLoaded", function(event, templateName){
            if(templateName === 'assets/user/partials/rent_search_filters.html'){
               $rootScope.filterSpinner = false; 
            }
        });
	
        /* Get the application storage type default (localstorage) */
    	var storageType = localStorageService.get('staySignedIn');
    	$rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
    		/* Set the header color for homepage and other pages */
    		$rootScope.blackheader = CommanSrv.getHeaderColor();

            // Get the header links
            $rootScope.navlinks = CommanSrv.navbarLinks();
    		if ( nextRoute !== null && nextRoute.access !== undefined && nextRoute.access.requiredLogin && !AuthSrv.isLogged && !localStorageService.get('user', storageType)) {
    		    AuthSrv.isLogged = 0;
    		    $location.path("/login");
    		}
    	});	

        // Redirect user to referer
        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            if( !angular.isUndefined(previousRoute) && !angular.isUndefined(previousRoute.$$route) ){
                var prevPath = previousRoute.$$route.originalPath; 
                $rootScope.previousPath = prevPath;
            }
        });
    	
    	
    	/* This will logout the user from the application */
    	$rootScope.clearToken = function () {
    		localStorageService.remove('staySignedIn','localStorage');
            localStorageService.remove('token', storageType);
            localStorageService.remove('user', storageType);
            delete $rootScope.user;
            AuthSrv.isLogged = false;
            $location.path('/login');
        };

        $rootScope.$on( 'TokenExpiredError', function( event, eventData ) {
           toastService.alert( {message: eventData.message , class: 'error'});
        });
        
        /* Set user for entire application */
    	$rootScope.user = localStorageService.get('user', storageType);

        $rootScope.toggleLeft = function(navID){
            $mdSidenav(navID).toggle();
        };

        $rootScope.closeSidenav = function(navID){
            $mdSidenav(navID).close();
        };
    }
]);