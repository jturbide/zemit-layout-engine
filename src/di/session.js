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
			
			load: function() {
				
				return new Promise((resolve, reject) => {
					$storage.get('session', 'settings').then((data) => {
						factory.data = data || {};
						resolve(factory.data);
					}).catch(reject);
				});
			},
			
			save: function() {
				
				return $storage.set('session', 'settings', this.data);
			},
			
			flush: function() {
				
				this.data = {};
				return $storage.set('session', 'settings', null);
			}
		};
		
		return factory;
	}]);
})();