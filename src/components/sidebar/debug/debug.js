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
				
				$s.history = $history;
				$s.version = Zemit.version;
				
				$s.dump = () => {
					var changes = $history.dump();
					var content = $zm.content.get(true, true);
					var data = {
						changes: changes,
						content: content,
						version: Zemit.version
					};
					console.log(data);
				};
			}
		}
	}]);
})();