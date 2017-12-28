(function() {
	Zemit.app.directive('zmToolbar', ['$history', '$zm', '$modal', '$config', function($history, $zm, $modal, $config) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				// Set container scopes
				var config = $config.get();
				$s.container = $zm.content.get();
				$s.zm = $zm;
				$s.history = $history;
				$s.$modal = $modal;
				
				$s.setTab = function(context) {
					$zm.action(function() {
						config.context = context;
					}, undefined, config);
				};
			}
		};
	}]);
})();