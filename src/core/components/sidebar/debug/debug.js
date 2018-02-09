/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Debug sidebar
	 */
	Zemit.app.directive('zmSidebarDebug', ['$zm', '$history', '$session', '$modal', '$debug', '$hook', '$timeout', '$i18n', function($zm, $history, $session, $modal, $debug, $hook, $timeout, $i18n) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/sidebar/debug/debug.html',
			link: ($s, $e, attrs) => {
				
				$s.history = $history;
				$s.version = Zemit.version;
				var settings = $session.get('settings');
				
				$session.prepare('settings', {
					sidebar: {
						debug: {
							details: {
								visible: true
							},
							settings: {
								visible: true
							},
							logs: {
								visible: true
							},
							actions: {
								visible: true
							}
						}
					}
				});
				
				$s.$settings = settings;
				$s.settings = settings.sidebar.debug;
				$s.$debug = $debug;
				
				var $console = $e.find('.zm-sidebar-debug-console');
				$hook.add('onDebugLog', (log) => {
					$timeout(() => $timeout(() => $console.scrollTop(1e10)));
				});
				
				$s.flushHistory = () => {
					$s.zm.session.flushHistory();
				};
				
				$s.flushAll = () => {
					
					$modal.dialog('debug_flush_all', {
						backdrop: true,
						title: $i18n.get('core.components.sidebar.debug.flushTitle'),
						content: $i18n.get('core.components.sidebar.debug.flushContent'),
						buttons: [{
							label: $i18n.get('core.components.sidebar.debug.flushBtn'),
							warning: true,
							callback: (event, modal) => {
								$s.zm.session.flushAll();
								modal.close();
							}
						}, {
							label: $i18n.get('core.di.modal.btnCancel'),
							default: true
						}, ]
					});
				};
				
				$s.dump = () => {
					
					var content = $session.get('content');
					var history = $history.dump();
					var data = {
						history: history,
						content: angular.fromJson(angular.toJson(content)),
						version: Zemit.version
					};
					
					console.log('DEBUG', data);
				};
			}
		}
	}]);
})();