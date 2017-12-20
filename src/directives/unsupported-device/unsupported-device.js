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
				
				$s.device = $device;
				$e.parents('zemit').eq(0).addClass('zm-dark');
			}
		};
	}]);
})();