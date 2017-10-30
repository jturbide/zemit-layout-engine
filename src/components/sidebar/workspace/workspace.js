/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Parameters directive
	 */
	Zemit.app.directive('zmSidebarWorkspace', ['$zm', '$history', '$config', function($zm, $history, $config) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/workspace/workspace.html',
			link: function ($s, $e, attrs) {
				
			}
		}
	}]);
})();