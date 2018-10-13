/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Workspace connect modal
	 */
	Zemit.app.directive('zmWorkspaceConnect', ['$segment', '$modal', function($segment, $modal) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/sidebar/workspace/modals/connect/connect.html',
			link: function ($s, $e, attrs) {
				
				$s.workspace = new ZmWorkspace();
				
				$s.connect = () => {
					return new Promise((resolve, reject) => {
						
						var promise = $s.workspace.getKey()
							? $segment.update($s.workspace)
							: $segment.add($s.workspace);
						
						promise.then(resolve)
							   .catch(err => $modal.error(err));
					});
				};
				
				$s.$emit('modalBodyReady', $s);
			}
		}
	}]);
})();