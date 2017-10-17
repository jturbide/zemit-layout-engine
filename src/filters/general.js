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