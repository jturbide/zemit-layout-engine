/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmFieldText', ['$device', function($device) {
		return {
			restrict: 'E',
			scope: {
				ngModel: '=',
				ngDisabled: '=?',
				autofocus: '=?'
			},
			templateUrl: 'core/directives/field/text/text.html',
			link: function ($s, $e, attrs) {
				
				$s.attrs = attrs;
				
				if($device.isTouch()) {
					$s.attrs.autofocus = undefined;
				}
			}
		}
	}]);
})();