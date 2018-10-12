/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.run(['$i18n', '$session', '$history', '$debug', '$modal', '$zm', function($i18n, $session, $history, $debug, $modal, $zm) {
		
		let flushHistory = () => {
			$zm.session.flushHistory();
		};
		
		let flushAll = () => {
			
			$modal.dialog('debug_flush_all', {
				backdrop: true,
				title: $i18n.get('core.components.sidebar.debug.flushTitle'),
				content: $i18n.get('core.components.sidebar.debug.flushContent'),
				buttons: [{
					label: $i18n.get('core.components.sidebar.debug.flushBtn'),
					warning: true,
					callback: (event, modal) => {
						$zm.session.flushAll();
						modal.close();
					}
				}, {
					label: $i18n.get('core.di.modal.btnCancel'),
					default: true
				}, ]
			});
		};
		
		let dump = () => {
			
			var segment = $session.get('settings').segment;
			var history = $history.dump();
			var data = {
				history: history,
				content: angular.fromJson(angular.toJson(segment.getContent())),
				version: Zemit.version
			};
			
			console.log('DEBUG', data);
		};
		
		$debug.addAction($i18n.get('core.components.sidebar.debug.actionsBtnDump'), dump);
		$debug.addAction($i18n.get('core.components.sidebar.debug.actionsBtnFlushHistory'), flushHistory);
		$debug.addAction($i18n.get('core.components.sidebar.debug.actionsBtnFlushMemory'), flushAll, true);
	}]);
	
	/**
	 * Debug sidebar
	 */
	Zemit.app.directive('zmSidebarDebug', ['$zm', '$history', '$session', '$debug', '$hook', '$timeout', function($zm, $history, $session, $debug, $hook, $timeout) {
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
					
					if($console.length === 0) {
						$console = $e.find('.zm-sidebar-debug-console');
					}
					
					$timeout(() => $timeout(() => $console.scrollTop(1e10)));
				});
			}
		}
	}]);
})();