/**
 * Zemit Toolbar
 * @author: <contact@dannycoulombe.com>
 * 
 * Add buttons and directives
 */
(function() {
	
	Zemit.app.factory('$toolbar', ['$object', function($object) {
		
		let factory = {
			
			left: [],
			middle: [],
			right: [],
			
			get: function(key) {
				
				return $object.get('zm-toolbar_' + key);
			},
			
			register: function(key, options = {}) {
				
				return $object.register('zm-toolbar_' + key, 'zm-toolbar', options);
			},
			
			addObjects: function(region, objects = [], options = {}) {
				
				let item = Object.assign({
					key: key,
					priority: 0,
					canAccess: () => true,
					isVisible: () => true,
				}, options);
			},
			
			addItem: function(region, key, options = {}) {
				
				let item = Object.assign({
					key: key,
					priority: 0,
					canAccess: () => true,
					isVisible: () => true,
				}, options);
				
				this[region].push(item);
			},
			
			hasItems: function() {
				
				return (this.left.length
					+ this.middle.length
					+ this.right.length) > 0;
			}
		};
		
		return factory;
	}]);
})();