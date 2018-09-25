/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmFieldSwitch', [function() {
		return {
			restrict: 'E',
			scope: {
				ngModel: '=',
				ngChange: '&'
			},
			templateUrl: 'core/directives/field/switch/switch.html',
			link: function ($s, $e, attrs) {
				
				$s.title = attrs.title;
				
				$s.toggle = function() {
					$s.ngModel = !$s.ngModel;
					$s.ngChange();
				};
			}
		}
	}]);
})();