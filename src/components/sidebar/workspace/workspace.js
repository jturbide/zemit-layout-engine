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
				
				var config = $config.get();
				var workspace = {
					organizations: [{
						key: 'dcoulombe',
						title: 'Danny Coulombe',
						data: [{
							'id': 1,
							'title': 'node1',
							'nodes': [{
									'id': 11,
									'title': 'node1.1',
									'nodes': [{
										'id': 111,
										'title': 'node1.1.1',
										'nodes': []
									}]
								},
								{
									'id': 12,
									'title': 'node1.2',
									'nodes': []
								}
							]
						}, {
							'id': 2,
							'title': 'node2',
							'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
							'nodes': [{
									'id': 21,
									'title': 'node2.1',
									'nodes': []
								},
								{
									'id': 22,
									'title': 'node2.2',
									'nodes': []
								}
							]
						}, {
							'id': 3,
							'title': 'node3',
							'nodes': [{
								'id': 31,
								'title': 'node3.1',
								'nodes': []
							}]
						}]
					}]
				};
				
				var tabsConfigs = {};
				angular.forEach(workspace.organizations, function(organization, key) {
					tabsConfigs[organization.key] = {
						visible: false
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
				$s.config = config.sidebar.workspace;
			}
		}
	}]);
})();