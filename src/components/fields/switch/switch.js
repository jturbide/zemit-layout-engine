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
			replace: true,
			scope: {
				value: '='
			},
			templateUrl: 'components/fields/switch/switch.html',
			link: function ($s, $e, attrs) {
				
				$s.title = attrs.title;
				
				$s.toggle = function() {
					
					$s.value = !$s.value;
				};
			}
		}
	}]);
})();