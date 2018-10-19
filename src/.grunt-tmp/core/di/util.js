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
			}
			
		};
		
		return factory;
	}]);
})();