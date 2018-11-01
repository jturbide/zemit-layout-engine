/**
 * Zemit Application Initialization
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2017-07-04
 * 
 * This is where all the zemitness begins.
 */
var Zemit = {
	version: 'dev'
};
(function() {
	
	Zemit.app = angular.module('zemit', [
		'ngAnimate',
		'ngRoute',
		'ngSanitize',
		'oc.lazyLoad'
	]);
	
	var onReadyList = [];
	Zemit.app.onReady = (args = []) => {
		onReadyList.push(args);
	};
	
	/**
	 * Dynamic directive loader
	 */
	Zemit.app.config(['$compileProvider', '$provide', '$locationProvider', '$controllerProvider', '$routeProvider', function($compileProvider, $provide, $locationProvider, $controllerProvider, $routeProvider) {
		
		$compileProvider.debugInfoEnabled(false);
		
		Zemit.app.compileProvider = $compileProvider;
		Zemit.app.provide = $provide;
		Zemit.app.controllerProvider = $controllerProvider.register;
		
		$provide.factory('$routeProvider', function () {
	        return $routeProvider;
	    });
		//$locationProvider.html5Mode(true);
	}]);
	
	Zemit.app.run(['$rootScope', '$injector', '$hook', function($rs, $injector, $hook) {
		
		$hook.add('onReady', () => {
			
			// Run onReady hooks
			onReadyList.forEach((args) => {
				let callback = args.slice(args.length - 1, args.length)[0];
				let params = args.slice(0, args.length - 1);
				let injectors = [];
				params.forEach((param) => {
					injectors.push($injector.get(param));
				});
				
				if(callback instanceof Function) {
					callback.apply(null, injectors);
				}
			});
			
			$rs.isReady = true;
		});
	}]);
	
	Zemit.app.directive('zemit', ['$zm', '$session', '$window', '$hook', '$device', '$database', '$i18n', '$debug', function($zm, $session, $window, $hook, $device, $database, $i18n, $debug) {
		return {
			restrict: 'E',
			replace: true,
			link: async function ($s, $e, attrs) {
				
				await $session.load();
				await $i18n.init();
				
				$debug.init('core', $i18n.get('core.debugTitle'));
				
				$zm.setBaseScope($s);
				$s.$device = $device;
				$s.t = $i18n.get;
				$s.$zemit = $e;
				
				// Prevent mobile contextual menu
				$e.on('contextmenu', function(event) {
					 event.preventDefault();
					 event.stopPropagation();
					 return false;
				});
				
				// Listen to window events
				$window.onpageshow = () => $hook.run('onPageShow');
				$window.onresize = () => $hook.run('onWindowResize');
				
				if($device.isStandalone()) {
					$window.onpagehide = () => $hook.run('onBeforeUnload');
				}
				else {
					$window.onbeforeunload = () => $hook.run('onBeforeUnload');
				}
				
				$s.$zemit.on('click', function(event) {
					$s.$broadcast('documentClick', event);
				});
				
				// Whenever all modules are loaded, run onReady hooks
				$hook.add('onAllModulesRan', () => {
					
					$hook.run('onReady');
					$debug.log('core', 'ONREADY');
				});
				
				// Allow other stuff to execute before the final state
				$hook.run('onBeforeReady');
				$debug.log('core', 'ONBEFOREREADY');
			}
		};
	}]);
	
	Zemit.app.directive('zmApp', [function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/app.html',
			link: async function ($s, $e, attrs) {
				
			}
		};
	}]);
})();