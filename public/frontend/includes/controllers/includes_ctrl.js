'use strict';

app.controller('includesCtrl', ['loginSignupPopup', '$rootScope', 'socket', 'http', 'timeout', 'toastyService', 'localData', '$scope', '$location',
	function(loginSignupPopup, $rootScope, socket, http, timeout, toastyService, localData, $scope, $location) {



		(function(){

			$scope.profileInfo = localData.data();

            if ($scope.profileInfo && $scope.profileInfo.image) {
                $scope.imagePath = $scope.profileInfo.image;
            }else{
                $scope.imagePath = "assets/img/frontend/camra-icon.png";
            }

		}());



		$scope.userSignInfo = {"country_code": "+61"};
		$scope.dobMaxDate = new Date();

		/*login sign popup*/
		$scope.loginSignup = function(ev, type){
			console.log("loginSignup");
			if (type == 'login') {
				loginSignupPopup.login(ev);
			}else if(type == 'signup'){
				loginSignupPopup.signup(ev);
			}
		};

         $rootScope.$on('callIncludesCtrl', function (event, data) {
              
               $scope.imagePath = data;

         }); 

   	      
        socket.emit('fist-test-socket', function(data) {
            // console.log("This is socket response");            
        });         

        socket.on('notification', function(data) {
            // console.log(data);            
        }); 


		$scope.fromFooterTo = function(url){
			$location.path(url);
		};
		
		$scope.toPage = function(url){
			$location.path(url);
		};

		
		/*Logout and clear token and info from browser*/

		$scope.logout = function(){

			var keys = ['userToken', 'user'];
			localData.removeItem(keys);
			
			timeout.sixHundredMiliSecond(function(){
				$location.path('/');
				toastyService.logoutNotification();				
			});

		};


		$scope.setClass = function(link, link1){

			var url = $location.path().split('/')[1];

			if (url == link) {
				return true;	
			}
			
		};

		$scope.toggleAdvanceSearch = function  () {

			 $(".listing-srchTop").css("display", "none");
			 $(".advancesrchBx").css("display", "block");
			 
		};

		
}]);