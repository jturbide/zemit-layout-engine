/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Parameters directive
	 */
	Zemit.app.directive('zmSidebarDebug', ['$zm', '$history', '$config', function($zm, $history, $config) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/debug/debug.html',
			link: function ($s, $e, attrs) {
				
				
			}
		}
	}]);
})();