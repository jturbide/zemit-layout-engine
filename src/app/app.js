/**
 * App initialization
 */
Zemit.app.controller('app', ['$scope', '$hook', '$i18n', '$route', '$object', function($s, $hook, $i18n, $route, $object) {
	
	let homeBtn = $object.instanciate('btn', {
		icon: 'home',
		route: 'home',
		tooltip: $i18n.get('app.homeBtnTooltip'),
		isDisabled: () => {
			return $route.isRoute('home');
		},
	});
	$object.register('homeBtn', homeBtn);
	
	let toolbar = $object.instanciate('toolbar');
	
	// Desktop
	toolbar.addChilds(['homeBtn', 'context', 'sep', 'undo', 'redo'], {
		region: 'left',
		isVisible: () => {
			return window.innerWidth > 768;
		}
	});
	toolbar.addChilds(['profile', 'sep', 'doc', 'settings'], {
		region: 'right',
		isVisible: () => {
			return window.innerWidth > 768;
		}
	});
	
	// Mobile
	toolbar.addChilds(['undo', 'redo'], {
		region: 'left',
		isVisible: () => {
			return window.innerWidth <= 767;
		}
	});
	toolbar.addChilds(['context'], {
		region: 'right',
		isVisible: () => {
			return window.innerWidth <= 767;
		}
	});
	$object.register('toolbarMain', toolbar);
	$s.toolbar = toolbar;

	let sidebar = $object.instanciate('sidebar');
	// sidebar.addChilds(['modules', 'infoIcon', 'debugIcon'], {
	// 	region: 'top'
	// });
	// sidebar.addChilds(['zemitIcon'], {
	// 	region: 'bottom'
	// });
	$object.register('sidebarMain', sidebar);
	$s.sidebar = sidebar;
	
	// let settings = $session.get('settings');
	// $sidebar.addTab('modules', {
	// 	priority: 100,
	// 	title: $i18n.get('core.directives.sidebar.tabs.modules'),
	// 	directive: 'zm-sidebar-modules',
	// 	isVisible: () => {
	// 		return settings.context === 'structure';
	// 	}
	// });
	
	// $toolbar.addItem('left', 'appHome', {
	// 	priority: -101,
	// 	type: 'button',
	// 	icon: 'home',
	// 	tooltip: $i18n.get('app.homeBtnTooltip'),
		
	// 	events: {
	// 		click: (event) => {
	// 			$route.gotoRoute('home');
	// 		}
	// 	}
	// });

	// $s.$sidebar = $sidebar;
}]);

Zemit.app.config(['$routeProvider', '$ocLazyLoadProvider', function($routeProvider, $ocLazyLoadProvider) {

	$routeProvider.when('/', {
		title: 'Welcome',
		name: 'home',
		templateUrl: 'app/controllers/home/home.html',
		controller: 'homeCtrl',
		resolve: {
			lazy: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([
					'app/controllers/home/home.js',
					'app/controllers/home/home.css'
				]);
			}]
		}
	}).when('/error/:code', {
		title: 'Error :code:',
		name: 'error',
		templateUrl: 'app/controllers/error/error.html',
		controller: 'errorCtrl',
		resolve: {
			lazy: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load([
					'app/controllers/error/error.js',
					'app/controllers/error/error.css'
				]);
			}]
		}
	}).otherwise({
		redirectTo: '/error/404'
	});
}]);
