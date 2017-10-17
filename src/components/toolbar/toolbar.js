(function() {
	Zemit.app.directive('zmToolbar', ['$history', '$zm', '$modal', function($history, $zm, $modal) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				// Set container scopes
				$s.container = $zm.content.get();
				$s.history = $history;
				$s.settings.tab = 'structure';
				$s.$modal = $modal;
				
				$s.setTab = function(tab) {
					$zm.action(function() {
						$s.settings.tab = tab;	
					}, undefined, $s.settings);
				};
				
				$s.toggleDebug = function() {
					
					$s.settings.debug = !$s.settings.debug;
					
					console.log('CONTAINER', $s.container);
					console.log('SETTINGS', $s.settings);
					console.log('HISTORY', $s.history.changes);
				};
			}
		};
	}]);
})();