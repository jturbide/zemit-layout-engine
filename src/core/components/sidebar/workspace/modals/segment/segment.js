/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Workspace segment management modal
	 */
	Zemit.app.directive('zmWorkspaceSegment', ['$modal', function($modal) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/sidebar/workspace/modals/segment/segment.html',
			link: function ($s, $e, attrs) {
				
				$s.segment = new ZmSegment();
				
				$s.$emit('modalBodyReady', $s);
			}
		}
	}]);
})();