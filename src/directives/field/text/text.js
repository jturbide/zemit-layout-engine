/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmFieldText', [function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				ngModel: '=',
				autofocus: '='
			},
			templateUrl: 'directives/field/text/text.html',
			link: function ($s, $e, attrs) {
				
				$s.attrs = attrs;
			}
		}
	}]);
})();