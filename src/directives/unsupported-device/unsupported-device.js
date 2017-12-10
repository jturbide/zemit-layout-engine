/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.directive("zmUnsupportedDevice", ['$device', function($device) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'directives/unsupported-device/unsupported-device.html',
			link: function ($s, $e, attrs) {
				
				
			}
		};
	}]);
})();