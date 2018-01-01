/**
 * Zemit Workspaces
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set workspaces
 */
(function() {
	Zemit.app.factory('$workspace', ['$storage', function($storage) {
	    
	    $storage.defineStore('workspace');
	    
		var factory = {
			
			data: {},
			
			get: (id) => {
			    return this.data[id];
			},
			
			getAll: () => {
			    return [];
			},
			
			set: (id, data) => {
			    this.data[id] = data;
			}
		};
		
		return factory;
	}]);
})();