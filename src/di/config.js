/**
 * Zemit Configs
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set configurations
 */
(function() {
	Zemit.app.factory('$config', [function() {
	    
		var factory = {
			
			data: {},
			
			get: function(name) {
				
				return name && this.data[name] || this.data;
			},
			
			set: function(name, value) {
				
				this.data[name] = value;
			},
			
			prepare: function(data) {
				
				var copy = angular.copy(this.data);
				angular.merge(this.data, data, copy);
			},
			
			load: function() {
				
				var json = localStorage.getItem('config');
				var data = angular.fromJson(json);
				
				this.data = data || {};
			},
			
			save: function() {
				
				var json = angular.toJson(this.data);
				localStorage.setItem('config', json);
			},
			
			flush: function() {
				localStorage.setItem('config', null);
				this.data = {};
			}
		};
		
		return factory;
	}]);
})();