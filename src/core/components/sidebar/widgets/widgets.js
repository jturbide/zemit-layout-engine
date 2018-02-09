(function() {
	Zemit.app.directive('zmSidebarWidgets', ['$session', '$filter', '$device', function($session, $filter, $device) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/sidebar/widgets/widgets.html',
			link: function ($s, $e, attrs) {
				
				var widgets = Zemit.widgets.getAll();
				var settings = $session.get('settings');
				
				// List of available widgets (items)
				var sections = {
					structure: {
						title: 'Structure',
						widgets: []
					},
					content: {
						title: 'Content',
						widgets: []
					},
					customizable: {
						title: 'Customizable',
						widgets: []
					},
					custom: {
						title: 'Custom',
						widgets: []
					}
				};
				
				var filters = {
					query: ''
				};
				
				var tabsConfigs = {};
				angular.forEach(sections, function(section, key) {
					tabsConfigs[key] = {
						visible: true
					};
				});
				
				var updateWidgets = function() {
					
					var noWidgetsFound = true;
					angular.forEach(sections, function(section, key) {
						section.widgets = [];
					});
					angular.forEach(widgets, function(widget, key) {
						var inject = widget.injectable;
						if(inject && sections[inject.section] && $filter('search')([inject], ['title','desc'], filters.query, true).length > 0) {
							sections[widget.injectable.section].widgets.push({
								type: key,
								title: inject.title,
								desc: inject.desc,
								icon: inject.icon
							});
							
							noWidgetsFound = false;
						}
					});
					
					$s.noWidgetsFound = noWidgetsFound;
				};
				updateWidgets();
				
				$s.$watch('filters.query', function(nv, ov) {
					updateWidgets();
				});
				
				$s.draggableOptions = {
					container: $e.parents('zemit:eq(0)').find('.zm-container-scrollable:eq(0)')[0],
					onBeforeStart: () => {
						
						// If in portrait mode, close all sidebar tabs
						if($device.isSmall()) {
							$s.sidebar.tabs.hideAll();
						}
					},
					onEnd: () => {
						if($device.isSmall()) {
							$s.$apply(function() {
								$s.sidebar.tabs.unhideAll();
								$s.sidebar.tabs.closeAll();
							});
						}
					}
				};
				
				$session.prepare('settings', {
					sidebar: {
						widgets: {
							tabs: tabsConfigs
						}
					}
				});
				
				$s.sections = sections;
				$s.filters = filters;
			}
		};
	}]);
})();