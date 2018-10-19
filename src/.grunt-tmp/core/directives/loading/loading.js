/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Loading bar
	 */
	Zemit.app.directive('zmLoading', [function() {
		return {
			restrict: 'E',
			scope: {
				visible: '='
			},
			templateUrl: 'core/directives/loading/loading.html',
			link: function ($s, $e, attrs) {
				
			}
		};
	}]);
})();