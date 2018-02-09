(function() {
	
	Zemit.app.directive('zmToolbar', ['$history', '$zm', '$modal', '$session', '$workspace', '$sessionWorkspace', '$hook', function($history, $zm, $modal, $session, $workspace, $sessionWorkspace, $hook) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				// Set container scopes
				var session = $session.getAll();
				var settings = session.settings;
				$s.container = session.content;
				$s.zm = $zm;
				$s.history = $history;
				$s.$modal = $modal;
				$s.session = session;
				
				$s.setTab = function(context) {
					
					var oldContext = settings.context;
					
					$zm.action(function() {
						settings.context = context;
					}, undefined, settings);
					
					$hook.run('onContextChange', context, oldContext);
				};
				
				$s.breadcrumbs = $sessionWorkspace.getBreadcrumbs();
				$s.$sessionWorkspace = $sessionWorkspace;
			}
		};
	}]);
})();