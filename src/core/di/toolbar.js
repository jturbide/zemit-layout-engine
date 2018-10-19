/**
 * Zemit Toolbar
 * @author: <contact@dannycoulombe.com>
 * 
 * Add buttons and directives
 */
(function() {
	
	Zemit.app.factory('$toolbar', [function() {
		
		let factory = {
			
			left: [],
			middle: [],
			right: [],
			
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