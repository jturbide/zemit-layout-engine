/**
 * Zemit Session
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set configurations
 */
(function() {
	Zemit.app.factory('$session', ['$storage', function($storage) {
	    
	    $storage.defineStore('session');
	    
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
			
			load: function(callback = () => {}) {
				
				$storage.get('session', 'settings', function(data) {
					factory.data = data || {};
					callback(factory.data);
				});
			},
			
			save: function() {
				
				$storage.set('session', 'settings', this.data);
			},
			
			flush: function() {
				
				$storage.set('session', 'settings', null);
				this.data = {};
			}
		};
		
		return factory;
	}]);
})();