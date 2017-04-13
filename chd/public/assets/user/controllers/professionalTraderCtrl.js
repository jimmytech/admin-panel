'use strict';

angular.module('app.controllers')
.controller('professionalTraderCtrl', ['$scope', '$location', '$rootScope', '$mdDialog', '$document',function($scope, $location, $rootScope, $mdDialog, $document){ 
	$scope.faqToggle = false;
	$scope.showAdvanced = function() {
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'assets/user/templates/profesional-trader-pop.html',
			parent: angular.element($document.body),
			clickOutsideToClose:true
		}); 
		
	}; 

	$scope.showcontact = function() {
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'assets/user/templates/my-cherrydoor-my-details-deactive-account-pop.html',
			parent: angular.element($document.body),
			clickOutsideToClose:true
		}); 
		
	}; 
	
	DialogController.$inject = ['$scope', '$mdDialog'];
	function DialogController($scope, $mdDialog) {
		$scope.cancel = function() {
			$mdDialog.hide();
		};
	}
	// Accordion script
	$scope.oneAtATime = true;	 
	 $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
 	};      

 	$scope.faqData = [
 		{
 			title: 'What is ……. all about?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'How does it work?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'What charges are there for Landlords?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'What is ……. all about?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'What charges are there for Tenants?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'What charges are there for Landlords?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'What is Rent Now?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		}, 		
 		{
 			title: 'Why do tenants have to place a holding deposit?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'Who keeps the holding deposit?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'Why do you offer to process deposits?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: ' What is the DPS?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'Can I see a copy of the OpenRent tenancy agreement / contract?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'How can I trust a digital signature?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'Are you a member of any letting agent associations?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'What happens to my tenancy / contract if you stop trading?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'I am a rogue landlord thinking of using your site to scam tenants!',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: 'I am a letting agent - can you find me tenants too?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: ' How do I pay you?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		},
 		{
 			title: ' Why did not I have to set a password?',
 			description: 'Your first listing is free and includes listing on portals including Rightmove, Zoopla and Gumtree, and access to all our Rent Now features for only £49.Our usual price is an upfront fee of £29 per property - but you can always earn more free listings by introducing friends to OpenRent!'
 		}
 	];

}]);