/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Parameters directive
	 */
	Zemit.app.directive('zmSidebarWorkspace', ['$zm', '$history', '$config', function($zm, $history, $config) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/workspace/workspace.html',
			link: function ($s, $e, attrs) {
				
				var data = [];
				var config = $config.get();
				var workspace = {
					organizations: [{
						key: 'dcoulombe',
						title: 'Danny Coulombe',
						data: data
					}]
				};
				var filters = {
					query: ''
				};
				var stats = {
					countNodes: function(nodes) {
						
						var count = function(nodes) {
							var total = nodes.length;
							for(var i = 0; i < nodes.length; i++) {
								total += count(nodes[i].nodes);
							}
							return total;
						};
						
						return count(nodes);
					}
				};
				
				var tabsConfigs = {};
				angular.forEach(workspace.organizations, function(organization, key) {
					tabsConfigs[organization.key] = {
						visible: key === 0 ? true : false
					};
				});
				
				$config.prepare({
					sidebar: {
						workspace: {
							tabs: tabsConfigs
						}
					}
				});
				
				$s.workspace = workspace;
				$s.filters = filters;
				$s.stats = stats;
			}
		}
	}]);
})();