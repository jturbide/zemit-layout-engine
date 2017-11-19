/**
 * @author <contact@dannycoulombe.com>
 */
(function() {

	/**
	 * General directives
	 */
	Zemit.app.filter('decodeURI', function() {
		return function(uri) {
			return decodeURI(uri);
		}
	});
	
	/**
	 * Search in array
	 */
	Zemit.app.filter('search', function() {
		return function(data, keys, query, strict) {
			
			if(!(keys instanceof Array)) {
				keys = [keys];
			}
			
			// Convert the query in a clean array of keywords
			var keywords = query.trim().replace(/\s+/g,' ').replace(/^\s+|\s+$/,'').toLowerCase().split(' ');
			var results = [];
			
			angular.forEach(data, function(model, mKey) {
				
				var found = [];
				
				// Loop through all the keywords/keys
				keywordsLoop: for(var z = 0; z < keywords.length; z++) {
					keysLoop: for(var y = 0; y < keys.length; y++) {
						
						found[z] = (model.hasOwnProperty(keys[y])
							&& model[keys[y]].toLowerCase().trim().indexOf(keywords[z]) !== -1);
						
						if(found[z] && strict) {
							break keysLoop;
						}
						else if(found[z] && !strict) {
							break keywordsLoop;
						}
					}
				}
				
				// Verify if all items are of the same value
				var allEquals = found.every(function(value, index, array){
				    return value === array[0];
				});
				
				// If all true
				if(allEquals && found[0]) {
					results.push(model);
				}
			});
			
			return results;
		}
	});
	
	Zemit.app.filter('trustHtml', ['$sce', function($sce) {
        return function(value) {
            return $sce.trustAs('html', value);
        }
    }]);

	/**
	 * Group array items into rows/columns
	 */
	Zemit.app.filter('columnize', function() {
		return function(items, amount) {
			
			var arr = [];
			var idx = 0;
			for (var i = 0; i < (items || []).length; i++) {
				
				if(i % amount === 0 && i > 0) {
					idx++;
				}
				
				arr[idx] = arr[idx] || [];
				arr[idx].push(items[i]);
			}
			return arr;
		}
	});
})();