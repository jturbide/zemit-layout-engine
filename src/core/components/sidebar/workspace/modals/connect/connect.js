/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Workspace connect modal
	 */
	Zemit.app.directive('zmWorkspaceConnect', ['$workspace', '$modal', function($workspace, $modal) {
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
							? $workspace.update($s.workspace)
							: $workspace.add($s.workspace);
						
						promise.then(resolve)
							   .catch(err => $modal.error(err));
					});
				};
				
				$s.$emit('modalBodyReady', $s);
			}
		}
	}]);
})();