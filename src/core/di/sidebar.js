/**
 * Zemit Sidebar
 * @author: <contact@dannycoulombe.com>
 * 
 * Add icons and tabs
 */
(function() {
	
	Zemit.app.factory('$sidebar', [function() {
		
		let factory = {
			
			icons: [],
			tabs: [],
			
			addIcon: function(key, options = {}) {
				
				let icon = Object.assign({
					key: key,
					priority: 0,
					canAccess: () => true,
					isVisible: () => true,
				}, options);
				
				this.icons.push(icon);
			},
			
			addTab: function(key, options = {}) {
				
				let tab = Object.assign({
					key: key,
					priority: 0,
					canAccess: () => true,
					isVisible: () => true,
				}, options);
				
				this.tabs.push(tab);
			}
		};
		
		return factory;
	}]);
})();