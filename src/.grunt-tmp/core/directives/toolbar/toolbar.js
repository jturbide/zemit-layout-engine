(function() {
	Zemit.app.directive('zmToolbar', ['$zm', '$modal', '$session', '$hook', '$device', '$toolbar', function($zm, $modal, $session, $hook, $device, $toolbar) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/directives/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				// Set container scopes
				var session = $session.getAll();
				var settings = session.settings;
				
				$s.zm = $zm;
				$s.$modal = $modal;
				$s.session = session;
				$s.$device = $device;
				$s.sections = ['left', 'middle', 'right'];
				$s.$toolbar = $toolbar;
				
				$s.setTab = function(context) {
					
					var oldContext = settings.context;
					
					$zm.action(function() {
						settings.context = context;
					}, undefined, settings);
					
					$hook.run('onContextChange', context, oldContext);
				};
			}
		};
	}]);
})();