(function() {
	Zemit.app.directive('zmToolbar', ['$history', '$zm', '$modal', '$session', function($history, $zm, $modal, $session) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				// Set container scopes
				var session = $session.get();
				$s.container = $zm.content.get();
				$s.zm = $zm;
				$s.history = $history;
				$s.$modal = $modal;
				
				$s.setTab = function(context) {
					$zm.action(function() {
						session.context = context;
					}, undefined, session);
				};
			}
		};
	}]);
})();