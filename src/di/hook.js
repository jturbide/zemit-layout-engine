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
				
				var vm = this;
				
				if(typeof name === 'string') {
					name = [name];
				}
				
				name.forEach(function(n) {
					if(!vm.list[n]) {
						vm.list[n] = [];
					}
					vm.list[n].push(callback);
				});
			},
			
			run: function(name, params) {
				
				var vm = this;
				var hooks = vm.list[name];
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