/**
 * Zemit Device
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.factory('$device', [function() {
		
		var factory = {
			
			_isTouch: null,
			_isPrecise: null,
			
			vibrate: function(delay = 100) {
				
				console.log('VIBRATE', delay);
				
				if(navigator.vibrate) {
					navigator.vibrate(delay);
				}
			},
			
			isTouch: function() {
				return window.matchMedia('(pointer: coarse)').matches;
			},
			
			isPrecise: function() {
				return window.matchMedia('(pointer: fine)').matches;
			}
		};
		
		factory._isTouch = factory.isTouch();
		factory._isPrecise = factory.isPrecise();
		
		return factory;
	}]);
})();