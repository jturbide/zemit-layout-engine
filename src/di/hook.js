/**
 * Zemit Hooks
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set hooks
 */
(function() {
	Zemit.app.factory('$hook', [function() {
	    
	    var structure = {
	    	
	    	list: {},
	    	
	    	$new: function() {
				return angular.copy(defaultStructure);
			},
				
			add: function(name, callback) {
				if(!this.list[name]) {
					this.list[name] = [];
				}
				this.list[name].push(callback);
			},
			
			run: function(name, params) {
				var hooks = this.list[name];
				if(hooks) {
					angular.forEach(hooks, function(hook) {
						hook(params);
					});
				}
			}
	    };
	    
	    var defaultStructure = angular.copy(structure);
	    
		return structure;
	}]);
})();