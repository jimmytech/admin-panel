
app.factory('PostcodeSvr', ['$http', 'POSTCODE', function ($http, POSTCODE) {    
    return {
    	lookup: function(postcode, cache){
    		var url = POSTCODE.API_URL + 'v1/postcodes/' + postcode + '?api_key=' + POSTCODE.API_KEY;
    		return $http.get(url, {cache: cache});
    	},
    	address: function(address, cache){
    		var url = POSTCODE.API_URL + 'v1/addresses?q=' + address + '&api_key=' + POSTCODE.API_KEY;
    		return $http.get(url, {cache: cache});
    	},
    	autocomplete: function(address, cache){
    		var url = POSTCODE.API_URL + 'v1/autocomplete/addresses?q=' + address + '&api_key=' + POSTCODE.API_KEY;
    		return $http.get(url, {cache: cache});
    	}
    };
}]);