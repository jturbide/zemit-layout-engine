(function() {
	Zemit.app.directive('zmToolbar', ['$history', '$zm', '$modal', '$config', function($history, $zm, $modal, $config) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				$config.prepare({
					toolbar: {
						tab: 'structure'
					}
				});
				
				// Set container scopes
				var config = $config.get();
				$s.container = $zm.content.get();
				$s.history = $history;
				$s.$modal = $modal;
				
				$s.setTab = function(tab) {
					$zm.action(function() {
						config.toolbar.tab = tab;
					}, undefined, config);
				};
				
				$s.toggleDebug = function() {
					
					$config.data.debug = !$config.data.debug;
					
					console.log('CONTAINER', $s.container);
					console.log('CONFIG', $config);
					console.log('HISTORY', $s.history.changes);
				};
			}
		};
	}]);
})();