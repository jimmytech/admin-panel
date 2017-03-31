'use strict';

app.controller('includesCtrl', ['socket', 'http', 'timeout', 'toastyService', 'localData', '$scope', '$location',
	function(socket, http, timeout, toastyService, localData, $scope, $location) {

        socket.emit('fist-test-socket', function(data) {
            console.log("This is socket response");            
        });         

        socket.on('notification', function(data) {
            console.log(data);            
        }); 


		(function(){
			$scope.profileInfo = localData.data();
		}());
		
		$scope.toPage = function(url){
			$location.path(url);
		};
		
		/*Logout and clear token and info from browser*/

		$scope.logout = function(){

			var keys = ['t', 'user'];
			localData.removeItem(keys);
			
			timeout.fiveHundredMiliSecond(function(){
				$location.path('/');
				toastyService.logoutNotification();				
			});

		};


		$scope.setClass = function(link){

			var url = $location.path().split('/')[1];

			if (url == link) {
				return true;	
			}
			
		};
}]);