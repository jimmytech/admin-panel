'use strict';

angular.module('app.factories')
    .factory('CommanSrv', ['$location', '$rootScope', function($location, $rootScope) {
        return {
            getHeaderColor: function() {
                return $location.path() === '/' ? false : true;
            },

            /*header links*/
            navbarLinks: function() {
                var landloardUrl =  ($rootScope.user && $rootScope.user.role === 'landlord') ? '/property-room-details': '/landload-intro';
                var myCherrydoorUrl = $rootScope.user ? '/my-cherrydoor/details' : '/login';
                return [
                    {url: '/property-sale', icon: 'account_balance', text: 'For Sale'},
                    {url: '/property-rent', icon: 'home', text: 'For Rent'},
                    {url: '', icon: 'person', text: 'Student Rental'},
                    {url: '/professional-trades', icon: 'person_outline', text: 'Professional Trades'},
                    {url: '', icon: 'share', text: 'Share'},
                    {url: '', icon: 'check_circle', text: 'Commercial'},
                    {url: landloardUrl, icon: 'account_box', text: 'Landlords'}, 
                    {url: myCherrydoorUrl, icon: 'account_circle', text: 'My CherryDoor'}
                ];
            },

            /*user profile menu links*/
            profileMenuLinks: function() {
                var myRequest = ($rootScope.user && $rootScope.user.role === 'landlord')?
                '/my-cherrydoor/requests/my-enquires' :
                '/my-cherrydoor/requests/tradesman-job-requests';

                return [
                {icon: 'star_rate', url: myRequest, text: 'My requests'},
                {icon: 'person', url: '/my-cherrydoor/details', text: 'My Details'},
                {icon: 'favorite', url: '/my-cherrydoor/saved-properties', text: 'Saved Properties'},
                {icon: 'notifications', url: '/my-cherrydoor/alerts-searches', text: 'Alerts & Searches'},
                {icon: 'mode_edit', url: '/my-cherrydoor/draw-search', text: 'Draw a Search'},
                {icon: 'home', url: '/my-cherrydoor/properties', text: 'My Properties'},
                {icon: 'remove_circle_outline', url: '/my-cherrydoor/london-tube', text: 'London Tube & Railway Station'}
                ];
            },

            /*use request menu links*/
            requestMenuLinks: function(){
                var role;
                var links =  [{url: '/my-cherrydoor/requests/my-enquires', text: 'MY ENQUIRERS'},
                {url: '/my-cherrydoor/requests/tradesman-job-requests', text: 'TRADESMAN-JOB-REQUESTS'}]; 

                /*check if user is logged in*/
                if ($rootScope.user) {
                    role = $rootScope.user.role; // find user type
                }
                /*check user is landlord*/
                if (role == 'landlord') {
                    links.splice(1, 1); // remove (tradesman-job-requests) url from url list
                }               
                return links;
            },


            myDetailLinks: function(){
                return [
                {url: '/my-cherrydoor/details', text: 'Update contact details'},
                {url: '/my-cherrydoor/details/change-my-password', text: 'Change my password'},
                {url: '/my-cherrydoor/details/change-my-email', text: 'Change your email'},
                {url: '/my-cherrydoor/details/deactivate-my-account', text: 'Deactivate Account'},
                {url: '/my-cherrydoor/details/verify-details', text: 'Verify Details'},
                {url: '', text: 'Messaging'}
                ];
            }
        };
    }])
    .factory('PostcodeSvr', ['$http', 'POSTCODE', function($http, POSTCODE) {
        return {
            lookup: function(postcode, cache) {
                var url = POSTCODE.API_URL + 'v1/postcodes/' + postcode + '?api_key=' + POSTCODE.API_KEY;
                return $http.get(url, {
                    cache: cache
                });
            },
            address: function(address, cache) {
                var url = POSTCODE.API_URL + 'v1/addresses?q=' + address + '&api_key=' + POSTCODE.API_KEY;
                return $http.get(url, {
                    cache: cache
                });
            },
            autocomplete: function(address, cache) {
                var url = POSTCODE.API_URL + 'v1/autocomplete/addresses?q=' + address + '&api_key=' + POSTCODE.API_KEY;
                return $http.get(url, {
                    cache: cache
                });
            }
        };
    }]);