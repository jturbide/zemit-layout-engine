/**
 * Zemit Configs
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set configurations
 */
(function() {
	Zemit.app.factory('$config', ['$storage', function($storage) {
	    
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
			
			load: function(callback) {
				
				$storage.get('config', 'config', function(value) {
					var data = angular.fromJson(value);
					factory.data = data || {};
					callback && callback(factory.data);
				});
			},
			
			save: function() {
				
				var json = angular.toJson(this.data);
				$storage.set('config', 'config', json);
			},
			
			flush: function() {
				
				$storage.set('config', 'config', null);
				localStorage.setItem('config', null);
				this.data = {};
			}
		};
		
		return factory;
	}]);
})();