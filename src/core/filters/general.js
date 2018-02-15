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
	 * Format date
	 */
	Zemit.app.filter('date', function() {
		return function(date, format) {
			
			if(typeof date === 'string') {
				date = new Date(date);
			}
			
			let formattedDate = format;
			
			let YYYY = format.indexOf('YYYY');
			let MM = format.indexOf('MM');
			let DD = format.indexOf('DD');
			let HH = format.indexOf('HH');
			let hh = format.indexOf('hh');
			let mm = format.indexOf('mm');
			let ss = format.indexOf('ss');
			let ms = format.indexOf('ms');
			
			if(YYYY !== -1) {
				formattedDate = formattedDate.replace('YYYY', date.getFullYear());
			}
			if(MM !== -1) {
				let month = date.getMonth() + 1;
				month = month < 10 ? '0' + month : month;
				formattedDate = formattedDate.replace('MM', month);
			}
			if(DD !== -1) {
				let day = date.getDate();
				day = day < 10 ? '0' + day : day;
				formattedDate = formattedDate.replace('DD', day);
			}
			if(HH !== -1) {
				let hours = date.getHours();
				hours = hours < 10 ? '0' + hours : hours;
				formattedDate = formattedDate.replace('HH', hours);
			}
			if(mm !== -1) {
				let minutes = date.getMinutes();
				minutes = minutes < 10 ? '0' + minutes : minutes;
				formattedDate = formattedDate.replace('mm', minutes);
			}
			if(ss !== -1) {
				let seconds = date.getSeconds();
				seconds = seconds < 10 ? '0' + seconds : seconds;
				formattedDate = formattedDate.replace('ss', seconds);
			}
			if(ms !== -1) {
				let milliseconds = date.getMilliseconds();
				milliseconds = milliseconds < 10
					? '00' + milliseconds
					: milliseconds < 100
						? '0' + milliseconds
						: milliseconds;
				
				formattedDate = formattedDate.replace('ms', milliseconds);
			}
			
			return formattedDate;
		}
	});
	
	/**
	 * Reverse array
	 */
	Zemit.app.filter('reverse', function() {
		return function(items) {
			return items.reverse();
		}
	});
	
	/**
	 * Search in array
	 */
	Zemit.app.filter('search', function() {
		return function(data, keys, query, strict = false) {
			
			if(!(keys instanceof Array)) {
				keys = [keys];
			}
			
			if(!query) {
				return data;
			}
			
			// Convert the query in a clean array of keywords
			var keywords = query.trim().replace(/\s+/g,' ').replace(/^\s+|\s+$/,'').toLowerCase().split(' ');
			var results = [];
			
			angular.forEach(data, function(model, mKey) {
				
				var found = [];
				
				// Loop through all the keywords/keys
				keywordsLoop: for(var z = 0; z < keywords.length; z++) {
					keysLoop: for(var y = 0; y < keys.length; y++) {
						
						if(keys[y] instanceof Function) {
							found[z] = keys[y](model).toLowerCase().trim().indexOf(keywords[z]) !== -1;
						}
						else {
							found[z] = (model.hasOwnProperty(keys[y])
								&& model[keys[y]].toLowerCase().trim().indexOf(keywords[z]) !== -1);
						}
						
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
	
	Zemit.app.filter('stringify', function() {
		return function(data) {
			return JSON.stringify(data);
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