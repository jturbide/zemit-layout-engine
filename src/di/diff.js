/**
 * Zemit Difference Manager
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and apply deep object differences
 */
(function() {
	Zemit.app.factory('$diff', [function() {
	    
		var factory = {
			
			constants: {
				PRIMITIVE: 0,
				CHANGED: 1,
				ADDED: 2,
				REMOVED: 3,
				EQUAL: 4
			},
			
			/**
			 * Apply deep object differences
			 */
			applyDifferences: function(scope, diff, inverse) {
				
				if(inverse) {
					diff = jsondiffpatch.reverse(diff);
				}
				
				jsondiffpatch.patch(scope, diff);
			},
			
			/**
			 * Get deep object differences
			 * 
			 * Original script from: https://github.com/NV/objectDiff.js
			 */
			getDifferences: function(left, right) {
				
				left = angular.fromJson(angular.toJson(left));
				right = angular.fromJson(angular.toJson(right));
				
				var diffpatcher = jsondiffpatch.create({
					objectHash: function(obj) {
				        return obj.token;
				    }
			    });
				
				return diffpatcher.diff(left, right);
			}
		};
		
		return factory;
	}]);
})();