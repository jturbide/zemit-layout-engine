/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Workspace project management modal
	 */
	Zemit.app.directive('zmWorkspaceProject', ['$modal', function($modal) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/sidebar/workspace/modals/project/project.html',
			link: function ($s, $e, attrs) {
				
				$s.project = new ZmProject();
				
				$s.$emit('modalBodyReady', $s);
			}
		}
	}]);
})();