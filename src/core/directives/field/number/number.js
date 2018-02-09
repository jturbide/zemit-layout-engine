/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmFieldNumber', ['$device', function($device) {
		return {
			restrict: 'E',
			scope: {
				ngModel: '=',
				ngDisabled: '=?',
				autofocus: '=?'
			},
			templateUrl: 'core/directives/field/number/number.html',
			link: function ($s, $e, attrs) {
				
				$s.attrs = attrs;
				
				if($device.isTouch()) {
					$s.attrs.autofocus = undefined;
				}
			}
		}
	}]);
})();