'use strict';

/* Application routes */
angular.module('app.routes', ['ngRoute','angular-loading-bar'])
.config(['$routeProvider', 'cfpLoadingBarProvider','$locationProvider',function($routeProvider, cfpLoadingBarProvider,$locationProvider){
	cfpLoadingBarProvider.includeSpinner = false;
	$routeProvider
	.when('/', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/home/views/home.html',

		access: {requiredLogin: false}
	})
	.when('/login', {
		controller: 'authCtrl',
		templateUrl: 'assets/user/auth/views/login.html',
		access: {requiredLogin: false}
	})
	.when('/register', {
		controller: 'authCtrl',
		templateUrl: 'assets/user/auth/views/register.html',
		access: {requiredLogin: false}
	})
	.when('/forgot-password', {
		controller: 'authCtrl',
		templateUrl: 'assets/user/auth/views/forgot_password.html',
		access: {requiredLogin: false}
	})
	.when('/reset/:token', {
		controller: 'authCtrl',
		templateUrl: 'assets/user/auth/views/reset_password.html',
		access: {requiredLogin: false}
	})
	.when('/invalid-password', {
		templateUrl: 'assets/user/templates/invalid-password.html',
		access: {requiredLogin: false}
	})
	.when('/payment-successful', {
		templateUrl: 'assets/user/properties/views/payment-successful.html',
		access: {requiredLogin: false}
	})	
	.when('/transaction-failed', {
		templateUrl: 'assets/user/properties/views/payment-failed.html',
		access: {requiredLogin: false}
	})
	.when('/invalid-email-link', {
		templateUrl: 'assets/user/templates/invalid-email-link.html',
		access: {requiredLogin: false}
	})
	.when('/create-alerts-searches', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/create-alerts-searches.html',
		access: {requiredLogin: true}
	})

	// start detail menu links
	.when('/my-cherrydoor/details/change-my-password', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/change-password.html',
		access: {requiredLogin: true}
	})
	.when('/my-cherrydoor/details/change-my-email', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/change-email.html',
		access: {requiredLogin: true}
	})	
	.when('/my-cherrydoor/details/deactivate-my-account', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/deactivate-account.html',
		access: {requiredLogin: true}
	})		
	.when('/my-cherrydoor/details/verify-details', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/verify-details.html',
		access: {requiredLogin: true}
	})

	// end detail menu links



	// start profile menu links

	.when('/my-cherrydoor/requests/my-enquires', {
		controller: 'landlordEnquiriesCtrl',
		templateUrl: 'assets/user/tenant/views/tenant-enquires.html',
		access: {requiredLogin: true}
	})	
	.when('/my-cherrydoor/requests/tradesman-job-requests', {
		controller: 'proTraderCtrl',
		templateUrl: 'assets/user/professional-trader/views/tradesman-job-requests.html',
		access: {requiredLogin: true}
	})	
	.when('/my-cherrydoor/details', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/my-detail.html',
		access: {requiredLogin: true}
	})
	.when('/my-cherrydoor/saved-properties', {
		controller: 'savedPropertiesCtrl',
		templateUrl: 'assets/user/profile/views/saved-properties.html',
		access: {requiredLogin: true}
	})	
	.when('/my-cherrydoor/alerts-searches', {
		controller: 'alertSearchesCtrl',
		templateUrl: 'assets/user/profile/views/alerts-searches.html',
		access: {requiredLogin: true}
	})	
	.when('/my-cherrydoor/draw-search', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/draw-search.html',
		access: {requiredLogin: false}
	})
	.when('/my-cherrydoor/properties', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/my-properties.html',
		access: {requiredLogin: false}
	})
	.when('/my-cherrydoor/london-tube', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/profile/views/my-cherrydoor-london-tube.html',
		access: {requiredLogin: true}
	})			

	// end profile menu links 




	.when('/property-search-listing', {
		controller: 'searchCtrl',
		templateUrl: 'assets/user/search/views/property-search-listing.html',
		access: {requiredLogin: false}
	})
	.when('/save-search', {
		controller: 'saveSearchCtrl',
		templateUrl: 'assets/user/search/views/save-search.html',
		access: { requiredLogin: true }
	})
	.when('/property-search-listing-sample', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/templates/property-search-listing-sample.html',
		access: {requiredLogin: false}
	})
	.when('/draw-search-area', {
		controller: 'profileCtrl',
		templateUrl: 'assets/user/templates/draw-search-area.html',
		access: {requiredLogin: false}
	})
	.when('/property-room-details', {
		controller: 'propertiesCtrl',
		templateUrl: 'assets/user/properties/views/property-room-details.html',
		access: {requiredLogin: true}
	})
	.when('/property-tenancy-details', {
		controller: 'propertiesCtrl',
		templateUrl: 'assets/user/properties/views/property-tenancy-details-restriction.html',
		access: {requiredLogin: true}
	})
	.when('/property-sale-details', {
		controller: 'propertiesCtrl',
		templateUrl: 'assets/user/properties/views/property-sale-details.html',
		access: {requiredLogin: true}
	})
	.when('/property-media', {
		controller: 'propertiesCtrl',
		templateUrl: 'assets/user/properties/views/property-media.html',
		access: {requiredLogin: true}
	})
	.when('/checkout/:slug', {
		controller: 'checkoutCtrl',
		templateUrl: 'assets/user/properties/views/checkout.html',
		access: {requiredLogin: true}
	})
	.when('/property-listings', {
		controller: 'propertyListingCtrl',
		templateUrl: 'assets/user/properties/views/property-listings.html',
		access: {requiredLogin: true}
	})
	.when('/landload-intro', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/landload.html',
		access: {requiredLogin: false}
	})
	.when('/landload-details', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/landload-details.html',
		access: {requiredLogin: false}
	})
	.when('/landlord-property-preview/:slug', {
		controller: 'propertyDetailCtrl',
		templateUrl: 'assets/user/properties/views/property-detail.html',
		access: {requiredLogin: false}
	})
	.when('/landlord-detail', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/landlord-details.html',
		access: {requiredLogin: false}
	})
	.when('/professional-traders-account', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/professional-traders-account.html',
		access: {requiredLogin: false}
	})
	.when('/professional-traders-job', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/professional-traders-job.html',
		access: {requiredLogin: false}
	})
	.when('/professional-traders-my-payment', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/professional-traders-my-payment.html',
		access: {requiredLogin: false}
	})
	.when('/professional-traders-my-profile', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/professional-traders-my-profile.html',
		access: {requiredLogin: false}
	})	
	.when('/professional-traders-work-order', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/professional-traders-work-order.html',
		access: {requiredLogin: false}
	})
	.when('/professional-traders-my-services', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/professional-traders-my-services.html',
		access: {requiredLogin: false}
	})
	.when('/property/:slug', {
		controller: 'propertyDetailCtrl',
		templateUrl: 'assets/user/properties/views/property-detail.html',
		access: {requiredLogin: false}
	})
	.when('/property-sale', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/property-sale.html',
		access: {requiredLogin: false}
	})
	.when('/property-rent', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/property-rent.html',
		access: {requiredLogin: false}
	})
	.when('/professional-traders', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/professional-traders.html',
		access: {requiredLogin: false}
	})
	.when('/saved-property', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/saved-property.html',
		access: {requiredLogin: false}
	})
	.when('/saved-search', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/saved-search.html',
		access: {requiredLogin: false}
	})
	.when('/explore-neighbourhood-school', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/explore-neighbourhood-school.html',
		access: {requiredLogin: false}
	})
	.when('/explore-neighbourhood-borough-council', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/explore-neighbourhood-borough-council.html',
		access: {requiredLogin: false}
	})
	.when('/explore-neighbourhood-places-of-interest', {
		controller: 'homeCtrl',
		templateUrl: 'assets/user/templates/explore-neighbourhood-places-of-interest.html',
		access: {requiredLogin: false}
	})
	.when('/professional-trades', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/search-professional-trades.html',
		access: {requiredLogin: false}
	})
	.when('/become-franchise', {
		controller: 'becomeFranchiseeCtrl',
		templateUrl: 'assets/user/franchisee/views/become-franchise.html',
		access: {requiredLogin: false}
	})
	.when('/edit-property/:slug', {
		controller: 'editPropertiesCtrl',
		templateUrl: 'assets/user/properties/views/edit_property.html',
		access: {requiredLogin: true}
	})
	.when('/property-map-view', {
		controller: 'propertyListingCtrl',
		templateUrl: 'assets/user/properties/views/property-map-view.html',
		access: {requiredLogin: false}
	})
	.when('/landlord-account', {
		controller: 'landlordAccountCtrl',
		templateUrl: 'assets/user/landlord/views/landload-account.html', 
		access: { requiredLogin: true }
	})
	.when('/landlord-change-password', {
		controller: 'landlordAccountCtrl',
		templateUrl: 'assets/user/landlord/views/landlord-change-password.html',
		access: {requiredLogin: true}
	})
	.when('/landlord-banking', {
		controller: 'landlordBankingCtrl',
		templateUrl: 'assets/user/landlord/views/landlord-banking.html',
		access: {requiredLogin: true}
	})
	.when('/landload-dashboard-plan', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-dashboard-plan.html',
		access: {requiredLogin: true}
	})
	.when('/maintenance-work-orders', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/maintenance-work-orders.html',
		access: {requiredLogin: false}
	})
	.when('/landload-enquiries', {
		controller: 'landlordEnquiriesCtrl',
		templateUrl: 'assets/user/landlord/views/landload-enquiries.html',
		access: {requiredLogin: true}
	})	
	.when('/landload-professional-tradesman', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-professional-tradesman.html',
		access: {requiredLogin: false}
	})
	.when('/landload-property-viewing', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-property-viewing.html',
		access: {requiredLogin: false}
	})
	.when('/landload-property-visits', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-property-visits.html',
		access: {requiredLogin: false}
	})
	.when('/landload-safety-inspection', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-safety-inspection.html',
		access: {requiredLogin: false}
	})	
	.when('/landload-tenancy-details', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-tenancy-details.html',
		access: {requiredLogin: false}
	})
	.when('/landload-invoices', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-invoices.html',
		access: {requiredLogin: false}
	})	
	.when('/landload-important-messages', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-important-messages.html',
		access: {requiredLogin: false}
	})
	.when('/landload-electrical-safety', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-electrical-safety.html',
		access: {requiredLogin: false}
	})	
	.when('/landload-gas-safety', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-gas-safety.html',
		access: {requiredLogin: false}
	})
	.when('/landload-inventory-check-in', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-inventory-check-in.html',
		access: {requiredLogin: false}
	})
	.when('/landload-photography', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-photography.html',
		access: {requiredLogin: false}
	})
	.when('/landload-Insurance', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-Insurance.html',
		access: {requiredLogin: false}
	})
	.when('/landload-my-statements', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-my-statements.html',
		access: {requiredLogin: false}
	})
	.when('/landlord-Insurance-desh', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landlord-Insurance-desh.html',
		access: {requiredLogin: false}
	})	
	.when('/landlord-referencing', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landlord-referencing.html',
		access: {requiredLogin: false}
	})								
	.when('/deposit-protection', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landlord-deposit-protection.html', 
		access: {requiredLogin: false}
	})
	.when('/landload-epc', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-epc.html', 
		access: {requiredLogin: false}
	})	
	.when('/landload-assured', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/landlord/views/landload-assured.html', 
		access: {requiredLogin: false}
	})	
	.when('/where-to-live', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/where-to-live.html',
		access: {requiredLogin: false}
	})
	.when('/student-guide-to-renting', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/student-guide-to-renting.html',
		access: {requiredLogin: false}
	})
	.when('/living-in-private-halls', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/living-in-private-halls.html',
		access: {requiredLogin: false}
	})
	.when('/moving-out-of-a-property', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/moving-out-of-a-property.html',
		access: {requiredLogin: false}
	})
	.when('/international-students', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/international-students.html',
		access: {requiredLogin: false}
	})
	.when('/charity', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/charity.html',
		access: {requiredLogin: false}
	})

	.when('/securing-a-property', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/securing-a-property.html',
		access: {requiredLogin: false}
	})
	.when('/be-realistic-about-what-you-can-afford', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/be-realistic-about-what-you-can-afford.html',
		access: {requiredLogin: false}
	})
	.when('/tenancy-agreements', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/tenancy-agreements.html',
		access: {requiredLogin: false}
	})
	.when('/viewing-properties', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/viewing-properties.html',
		access: {requiredLogin: false}
	})
	.when('/condensation-and-mould', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/condensation-and-mould.html',
		access: {requiredLogin: false}
	})
	.when('/gas-safety', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/gas-safety.html',
		access: {requiredLogin: false}
	})
	.when('/inventories', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/inventories.html',
		access: {requiredLogin: false}
	})
	.when('/why-do-i-need', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/why-do-i-need.html',
		access: {requiredLogin: false}
	})
	.when('/your-listing', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/your-listing.html',
		access: {requiredLogin: false}
	})
	.when('/your-responsibilities', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/your-responsibilities.html',
		access: {requiredLogin: false}
	})
	.when('/legal-musts-for-landlord', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/legal-musts-for-landlord.html',
		access: {requiredLogin: false}
	})
	.when('/privacy-policy', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/privacy-policy.html',
		access: {requiredLogin: false}
	})
	.when('/tenancy-details-document', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/tenancy-details-document.html',
		access: {requiredLogin: false}
	})
	.when('/i-need-to-move-out-students', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/i-need-to-move-out-students.html',
		access: {requiredLogin: false}
	})
	.when('/what-are-my-requirements', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/what-are-my-requirements.html',
		access: {requiredLogin: false}
	})
	.when('/landlords-insurance-cover', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/landlords-insurance-cover.html',
		access: {requiredLogin: false}
	})
	.when('/pricing-and-letting-fee-information', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/pricing-and-letting-fee-information.html',
		access: {requiredLogin: false}
	})
	.when('/FAQ', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/FAQ.html',
		access: {requiredLogin: false}
	})
	.when('/FAQ-student', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/FAQ-student.html',
		access: {requiredLogin: false}
	})
	.when('/FAQ-tenants', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/FAQ-tenants.html',
		access: {requiredLogin: false}
	})
	.when('/about-us', {
		controller: 'professionalTraderCtrl',
		templateUrl: 'assets/user/templates/about-us.html',
		access: {requiredLogin: false}
	})
	.when('/offline', {
		controller: '',
		templateUrl: 'offline.html',
		access: {requiredLogin: false}
	})
	.otherwise({
		redirectTo: '/'
	});
	//use the HTML5 History API
	//$locationProvider.html5Mode(true);
	//isAllow.$inject = ['$scope', 'localStorageService'];
}]);
