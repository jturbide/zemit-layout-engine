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
		'ngSanitize'
	]);
	
	var onReadyList = [];
	Zemit.app.onReady = (args = []) => {
		onReadyList.push(args);
	};
	
	/**
	 * Dynamic directive loader
	 */
	Zemit.app.config(function($compileProvider) {
		$compileProvider.debugInfoEnabled(false);
		Zemit.app.compileProvider = $compileProvider;
	});
	
	Zemit.app.run(['$rootScope', '$i18n', '$injector', '$hook', function($rs, $i18n, $injector, $hook) {
		
		$hook.add('onReady', () => {
			onReadyList.forEach((args) => {
				let callback = args.splice(args.length - 1, 1)[0];
				let params = args;
				let injectors = [];
				params.forEach((param) => {
					injectors.push($injector.get(param));
				});
				callback.apply(null, injectors);
			});
		});
		
		Zemit.widgets.register([
			'core/components/widget/code',
			'core/components/widget/column',
			'core/components/widget/container',
			'core/components/widget/image',
			'core/components/widget/partial',
			'core/components/widget/row',
			'core/components/widget/segment',
			'core/components/widget/text'
		]);
	}]);
	
	Zemit.app.directive('zemit', ['$zm', '$compile', '$session', '$window', '$hook', '$device', '$storage', '$workspace', '$media', '$socket', '$i18n', function($zm, $compile, $session, $window, $hook, $device, $storage, $workspace, $media, $socket, $i18n) {
		return {
			restrict: 'E',
			link: async function ($s, $e, attrs) {
				
				await $storage.init();
				await $session.load();
				await $workspace.init();
				await $i18n.init();
				
				var session = await $session.getAll();		
				$session.prepare('settings', {
					context: 'structure'
				});
				
				$zm.setBaseScope($s);
				$s.zemit = session.content;
				$s.widget = $s.zemit;
				$s.settings = session.settings;
				$s.device = $device;
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
				
				// Prepare template
				var template = '<div tabindex="0" class="zemit-container">';
					
				if(!$device.isSupported()) {
					template += '<zm-unsupported-device></zm-unsupported-device>';
				}
				else {
					template += '<zm-toolbar></zm-toolbar>'
							  + '<zm-widget type="container"></zm-widget>';
				}
				
				template += '</div>';
				
				// Compile template
				var $template = angular.element(template);
				$e.append($template);
				$compile($template)($s);
				
				$s.$zemit.on('click', function(event) {
					$s.$broadcast('documentClick', event);
				});
				
				// OK, everything should be ready now
				$hook.run('onReady');
				
				console.log('ZEMIT INIT');
			}
		};
	}]);
})();