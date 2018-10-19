/**
 * App initialization
 */
Zemit.app.controller('app', ['$hook', '$device', '$i18n', '$sidebar', '$session', function($hook, $device, $i18n, $sidebar, $session) {
	
	let settings = $session.get('settings');
	// $sidebar.addTab('modules', {
	// 	priority: 100,
	// 	title: $i18n.get('core.directives.sidebar.tabs.modules'),
	// 	directive: 'zm-sidebar-modules',
	// 	isVisible: () => {
	// 		return settings.context === 'structure';
	// 	}
	// });
}]);