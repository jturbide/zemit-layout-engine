/**
 * Zemit Sidebar
 * @author: <contact@dannycoulombe.com>
 * 
 * Add icons and tabs
 */
(function() {
	
	Zemit.app.factory('$sidebar', ['$session', function($session) {
		
		let factory = {
			
			icons: [],
			tabs: [],
			
			items: [],
			
			get: function(key) {
				
				return this.items.find(item => {
					return item.key === key;
				});
			},
			
			register: function(key, options = {}) {
				
				if(this.get(key)) {
					throw new ZmError(0, 'Toolbar already existing.');
				}
				
				this.items.push({
					key: key,
					options: options
				});
			},
			
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
				
				let tabOptions = {};
				tabOptions[key] = {
					visible: false
				};
				
				$session.prepare('settings', {
					sidebar: {
						tabs: tabOptions
					}
				});
				
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