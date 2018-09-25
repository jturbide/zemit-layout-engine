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
			
			data: {},
			structure: {},
			settings: {
				maxLog: 250
			},
			
			init: function(namespace, label) {
				
				if(!settings) {
					settings = $session.get('settings');
				}
				
				let structure = settings.debug.log || [];
				
				if(!settings.debug.log.find((item) => item.namespace === namespace)) {
					structure.push({
						namespace: namespace,
						active: false,
						label: label
					});
				}
				
				$session.prepare('settings', {
					debug: {
						recent: [],
						log: structure,
						settings: {
							maxLog: this.settings.maxLog
						}
					}
				});
				
				this.data = settings.debug.log;
				this.recent = settings.debug.recent;
				this.settings = settings.debug.settings;
			},
			
			log: function(namespace, name, value) {
				
				let log = this.data.find((item) => item.namespace === namespace);
				
				if(settings.debug.activated && log && log.active) {
					
					let log = {
						datetime: new Date(),
						namespace: namespace,
						name: name,
						value: value.toString()
					};
					
					this.recent.push(log);
					
					while(this.recent.length > this.settings.maxLog) {
						this.recent.splice(0, 1);
					}
					
					console.log(namespace, name, value);
					
					$hook.run('onDebugLog', log);
				}
			}
		};
		
		return vm;
	}]);
})();