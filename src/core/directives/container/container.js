/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Container
	 */
	Zemit.app.directive('zmContainer', [function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: 'core/directives/container/container.html',
			link: function ($s, $e, attrs) {
				
			}
		};
	}]);
})();