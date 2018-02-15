/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Input field
	 */
	Zemit.app.directive('zmFieldInput', ['$device', '$compile', function($device, $compile) {
		return {
			restrict: 'E',
			templateUrl: 'core/directives/field/input/input.html',
			scope: true,
			compile: function($e, attrs) {
				
				if($device.isTouch()) {
					attrs.autofocus = undefined;
				}
				
				var $input = $e.find('input');
				angular.forEach(attrs.$attr, (dashed, key) => {
					
					if(['icon', 'class'].indexOf(dashed) !== -1) {
						return;
					}
					
					$e.attr(dashed, null);
					$input.attr(dashed, attrs[key]);
				});
				
				return {
					post: function($s, $e, attrs) {
						$s.attrs = attrs;
					}
				}
			}
		}
	}]);
})();