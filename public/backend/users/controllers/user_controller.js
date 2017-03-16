'use strict';

app.controller('userController', ['sortIcon', 'http', '$scope', '$location', 'socket', '$routeParams', 'paging',
	function (sortIcon, http, $scope, $location, socket, $routeParams, paging) {	


	// var socketObj = {'a': 1, 'b':2};
	// socket.emit('fist-test-socket', socketObj);
             
	(function(){

        $scope.paging = {page: 1};
        $scope.forceEllipses = paging.forceEllipses;
        $scope.maxSize = paging.maxSize;
		pageHeading();
		userList();

	})();


	function pageHeading() {

		var locationArray = $location.path().split('/');
		$scope.lastIndex = locationArray[locationArray.length-1];

		if ($scope.lastIndex == 'service-providers') {

			$scope.userType = "Service Provider";

		} else if ($scope.lastIndex == 'customers') {

			$scope.userType = "Customer";
			
		}

	}


	function userList () {
		var page = angular.isDefined($scope.paging) ? $scope.paging.page : 1;			
		http.get('/admin/user-list?type='+$scope.lastIndex+"&page="+page).then(function(response){
			$scope.data = response;
			$scope.paging = response.paging;
		});

	}

	function setPageNumberInUrl (n) {

		var page = angular.isDefined(n) ? n : $scope.paging.page;
		
		$location.search("page", page);

	} 

	$scope.search = function() {

		if (angular.isUndefined($scope.searchFor)) {	

			$scope.paging = {page:1};
			setPageNumberInUrl();	

			userList();			

		}else{

			var page = angular.isDefined($scope.paging) ? $scope.paging.page : 1;
			
			http.get('/admin/search-user?user='+$scope.lastIndex+"&page="+page+"&search="+$scope.searchFor).then(function(response){
				$scope.data = response;
				$scope.paging = response.paging;
			});	

		}

	};



    $scope.getMoreRecord = function(){    

    	if (angular.isDefined($scope.searchFor)) {
    		$scope.search();
    	}else{
    		userList();   		
    	}   
    	setPageNumberInUrl();                   
    	
    };	

     

	$scope.addNew = function(url){
		$location.path(url);
	};

	$scope.signUp = function(){
		console.log($scope.user);
	};

	$scope.sort = function(search, sortOn, event){
		 
		 var as_ds = sortIcon.set(event);  
         var sortType = as_ds === 1 ? '' : "-"; 

	};

}]);