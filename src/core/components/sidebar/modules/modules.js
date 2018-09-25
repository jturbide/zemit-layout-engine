/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Parameters directive
	 */
	Zemit.app.directive('zmSidebarModules', ['$zm', '$modal', '$i18n', '$modules', '$session', '$filter', function($zm, $modal, $i18n, $modules, $session, $filter) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/sidebar/modules/modules.html',
			link: function ($s, $e, attrs) {
				
				let settings = $session.get('settings');
				
				$session.prepare('settings', {
					modules: {},
					sidebar: {
						modules: {
							tabs: {}
						}
					},
				});
				
				$s.filters = {
					query: ''
				};
				$s.groups = $modules.getAllToArray();
				$s.filteredGroups = [];
				$s.tabs = settings.sidebar.modules.tabs;
				$s.settings = angular.copy(settings.modules);
				
				$s.toggle = (module, isActivated) => {
					
					if(!isActivated && module.props.onActivate instanceof Function) {
						module.activate();
						module.props.onActivate();
					}
					else if(isActivated && module.props.onDeactivate instanceof Function) {
						module.deactivate();
						module.props.onDeactivate();
					}
				};
				
				$s.hasDifferences = () => {
					return angular.toJson($s.settings) !== angular.toJson(settings.modules);
				};
				
				$s.apply = () => {
					
					$modal.dialog('modules_apply', {
						backdrop: true,
						title: $i18n.get('core.components.sidebar.modules.applyTitle'),
						content: $i18n.get('core.components.sidebar.modules.applyContent'),
						buttons: [{
							label: $i18n.get('core.components.sidebar.modules.applyBtn'),
							warning: true,
							callback: (event, modal) => {
								
								settings.modules = angular.copy($s.settings);
								
								window.location.reload();
								modal.close();
							}
						}, {
							label: $i18n.get('core.di.modal.btnCancel'),
							default: true
						}, ]
					});
				};
				
				$s.$watch('filters.query', () => {
					
					if(!$s.filters.query) {
						$s.filteredGroups = $s.groups;
					}
					
					let groups = [];
					let originalGroups = angular.copy($s.groups);
					originalGroups.forEach((group) => {
						let found = $filter('search')(group.modules, (module) => {
							return module.title + ' ' + module.desc + ' ' + group.title;
						}, $s.filters.query, true);
						
						if(found.length > 0) {
							group.modules = found
							groups = groups.concat(group);
						}
					});
					
					$s.filteredGroups = groups;
				});
			}
		}
	}]);
})();