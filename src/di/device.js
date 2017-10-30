/**
 * Zemit Device
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.factory('$device', [function() {
		
		var factory = {
			
			vibrate: function(delay = 100) {
				
				console.log('VIBRATE', delay);
				
				if(navigator.vibrate) {
					navigator.vibrate(delay);
				}
			}
		};
		
		return factory;
	}]);
})();