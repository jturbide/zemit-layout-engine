/**
 * Zemit Cache Manager
 * @author: <contact@dannycoulombe.com>
 * 
 * Store object in the cache
 */
(function() {
	Zemit.app.factory('$cache', [function() {
	    
		var factory = {
			
			values: {},
			
			set: function(id, value) {
				this.values[id] = value;
			},
			
			get: function(id, value) {
				return this.values[id];
			}
		};
		
		return factory;
	}]);
})();