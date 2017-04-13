app.factory('australia', ['http',
	function (http) {
		return {
			states: function(){

	            var statesArray = [
	                {name: "Australian Capital Territory", Value: "ACT"},
	                {name: "New South Wales", Value: "NSW"},
	                {name: "Northern Territory", Value: "NT"},
	                {name: "Queensland", Value: "QLD"},
	                {name: "South Australia", Value: "SA"},
	                {name: "Tasmania", Value: "TAS"},
	                {name: "Victoria", Value: "VIC"},
	                {name: "Western Australia", Value: "WA"}
	            ];

	            return statesArray;			
			}
		}
	}]);