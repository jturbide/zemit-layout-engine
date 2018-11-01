/**
 * Zemit Url
 * @author: <contact@dannycoulombe.com>
 * 
 * Set of different utility
 */
(function() {
	Zemit.app.factory('$util', [function() {
		
		var factory = {
			
			/**
			 * GUID generator
			 */
			s4: function() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			},
			
			guid: function() {
				return this.s4() + this.s4() + this.s4() + this.s4();
			},
			
			/**
			 * Convert string to camel cases
			 */
			camelize: function(str, firstUpper) {
				var strCamel = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
					return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
				}).replace(/\s+/g, '');
				
				return firstUpper === true
					? (strCamel.charAt(0).toUpperCase() + strCamel.slice(1))
					: strCamel;
			},
			
			/**
			 * Convert camelized strings to dashed
			 */
			snakeCase: function(str) {
				return str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
			},
			
			isValidDomain: function(string) {
				return string && (/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9](:[0-9]+)?$/.test(string));
			},
			
			isValidHost: function(string) {
				return string && (/^([a-z0-9-.]*)?[a-z0-9](:[0-9]+)?$/.test(string));
			},
			
			getUrlParam: function(param) {
				
				var result = null, tmp = [];
				
				location.search.substr(1).split("&").forEach(function (item) {
					tmp = item.split("=");
					if (tmp[0] === param) {
						result = decodeURIComponent(tmp[1]);
					}
				});
				
				return result;
			},
			
			/**
			 * Sort directed acyclic graphs
			 * https://gist.github.com/RubyTuesdayDONO/5006455
			 */
			topologicalSorting: function(graph) {
				
				var sorted = [], // sorted list of IDs ( returned value )
					visited = {}; // hash: id of already visited node => true
				
				 // 2. topological sort
				 Object.keys(graph).forEach(function visit(name, ancestors) {
				 	
					if (!Array.isArray(ancestors)) {
						ancestors = [];
					}
					
					ancestors.push(name);
					visited[name] = true;
				
					graph[name].forEach(function(dep) {
						if (ancestors.indexOf(dep) >= 0) { // if already in ancestors, a closed chain exists.
							throw new ZmError(0, 'Circular dependency "' + dep + '" is required by "' + name + '": ' + ancestors.join(' -> '));
						}
				
						// if already exists, do nothing
						if (visited[dep]) {
							return;
						}
						
						visit(dep, ancestors.slice(0)); // recursive call
					});
				
					if(sorted.indexOf(name) < 0) {
						sorted.push(name);
					}
				});
				
				return sorted;
			}
		};
		
		return factory;
	}]);
})();