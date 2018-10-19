/**
 * Zemit Debug
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.factory('$debug', ['$session', '$hook', function($session, $hook) {
		
		var settings = $session.get('settings');
		$session.prepare('settings', {
			debug: {
				activated: false,
				log: [],
				recent: [],
				settings: {
					showWidgetTokenId: false,
					maxLog: 250
				}
			}
		});
		
		var vm = {
			
			data: [],
			recent: [],
			namespaces: [],
			structure: {},
			actions: [],
			settings: {
				maxLog: 250
			},
			
			init: function(namespace, label) {
				
				// if(!settings) {
				// 	settings = $session.get('settings');
				// }
				
				let structure = settings.debug.log || [];
				let item = {
					namespace: namespace,
					active: false,
					label: label
				};
				
				if(!settings.debug.log.find((item) => item.namespace === namespace)) {
					structure.push(item);
				}
				
				$session.prepare('settings', {
					debug: {
						log: structure
					}
				});
				
				this.namespaces.push(namespace);
				
				this.data = settings.debug.log;
				this.recent = settings.debug.recent;
				this.settings = settings.debug.settings;
			},
			
			getActiveNamespaces: function(namespace) {
				
				let results = [];
				this.data.forEach(item => {
					if(this.namespaces.indexOf(item.namespace) !== -1) {
						results.push(item);
					}
				});
				
				return results;
			},
			
			log: function(namespace, name, value = null) {
				
				let log = this.data.find((item) => item.namespace === namespace);
				
				if(settings.debug.activated && log && log.active) {
					
					let log = {
						datetime: new Date(),
						namespace: namespace,
						name: name,
						value: (value || '').toString()
					};
					
					this.recent.push(log);
					
					while(this.recent.length > this.settings.maxLog) {
						this.recent.splice(0, 1);
					}
					
					console.log(namespace, name, value);
					
					$hook.run('onDebugLog', log);
				}
			},
			
			clearLogs: function() {
				
				this.recent = [];
				settings.debug.recent = [];
			},
			
			addAction: function(title, callback, warning = false) {
				
				this.actions.push({
					title: title,
					callback: callback,
					warning: warning
				});
			}
		};
		
		return vm;
	}]);
})();