/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Parameters directive
	 */
	Zemit.app.directive('zmSidebarDebug', ['$zm', '$history', '$session', function($zm, $history, $session) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/debug/debug.html',
			link: function ($s, $e, attrs) {
				
				$s.history = $history;
				$s.version = Zemit.version;
				
				$s.dump = () => {
					
					var content = $zm.content.get(true, true);
					var history = $history.dump();
					var data = {
						history: history,
						content: content,
						version: Zemit.version
					};
					
					console.log('DEBUG', data);
				};
			}
		}
	}]);
})();