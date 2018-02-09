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
			ranList: [],
			
			$new: function() {
				return angular.copy(defaultStructure);
			},
				
			add: function(name, callback, uniqId = null) {
				
				var vm = this;
				
				if(typeof name === 'string') {
					name = [name];
				}
				
				name.forEach(function(n) {
					if(!vm.list[n]) {
						vm.list[n] = [];
					}
					vm.list[n].push({
						uniqId: uniqId,
						callback: callback
					});
				});
			},
			
			run: function(name, ...params) {
				
				var vm = this;
				var hooks = vm.list[name];
				if(hooks) {
					angular.forEach(hooks, function(hook) {
						hook.callback(...params);
					});
				}
				
				if(this.ranList.indexOf(name) === -1) {
					this.ranList.push(name);	
				}
			},
			
			hasRan: function(name) {
				return this.ranList.indexOf(name) !== -1;
			},
			
			exists: function(name, id) {
				
				var result = false;
				(this.list[name] || []).every((item, key) => {
					if(item.uniqId === id) {
						result = true;
						return false;
					}
				});
				return result;
			},
			
			remove: function(name, id) {
				
				(this.list[name] || []).every((item, key) => {
					if(item.uniqId === id) {
						this.list.splice(key, 1);
						return false;
					}
				});
			}
		};
		
		var defaultStructure = angular.copy(structure);
		
		return structure;
	}]);
})();