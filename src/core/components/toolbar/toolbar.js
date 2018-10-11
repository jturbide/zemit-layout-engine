(function() {
	
	Zemit.app.directive('zmToolbar', ['$history', '$zm', '$modal', '$session', '$workspace', '$sessionWorkspace', '$hook', '$profile', '$device', function($history, $zm, $modal, $session, $workspace, $sessionWorkspace, $hook, $profile, $device) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				// Set container scopes
				var session = $session.getAll();
				var settings = session.settings;
				$s.zm = $zm;
				$s.history = $history;
				$s.$modal = $modal;
				$s.session = session;
				$s.$profile = $profile;
				$s.$device = $device;
				
				$s.closeSegment = () => {
					$sessionWorkspace.closeSegment();
				};
				
				$s.setTab = function(context) {
					
					var oldContext = settings.context;
					
					$zm.action(function() {
						settings.context = context;
					}, undefined, settings);
					
					$hook.run('onContextChange', context, oldContext);
				};
				
				$s.segment = $sessionWorkspace.segment;
				$s.breadcrumbs = $sessionWorkspace.getBreadcrumbs();
				$s.$sessionWorkspace = $sessionWorkspace;
			}
		};
	}]);
})();