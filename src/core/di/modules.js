/**
 * Zemit Module Initialization
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2018-09-24
 * 
 * Initialize all the modules
 */
(function() {
	
	Zemit.app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
		$ocLazyLoadProvider.config({
			// debug: Zemit.version === 'dev',
			events: true
		});
	}]);
	
	Zemit.app.factory('$modules', ['$ocLazyLoad', '$session', '$hook', '$i18n', function($ocLazyLoad, $session, $hook, $i18n) {
		
		var settings = $session.get('settings');
		$session.prepare('settings', {
			modules: {}
		});
		
		var factory = {
			
			itemsArray: [],
			items: {},
			
			bootstrap: (modules = []) => {
				
				if(modules instanceof String) {
					modules = [modules];
				}
				
				modules.forEach((name) => {
					
					console.log(name.toUpperCase() + ' MODULE INIT');
					
					let options = {
						modules: {}
					};
					options.modules[name] = {
						activated: false
					};
					$session.prepare('settings', options);
					
					$ocLazyLoad.load({
						rerun: true,
						reconfig: true,
						files: [
							'./modules/' + name + '/' + name + '.js',
							'./modules/' + name + '/' + name + '.css'
						]
					});
				});
			},
			
			config: function (name, group, props = {}, isCore) {
				
				let module = {
					_activated: false,
					_isCore: isCore,
					
					isCore: function() {
						return this._isCore;
					},
					isActivated: function() {
						return this._activated;
					},
					activate: function() {
						this._activated = true;
					},
					deactivate: function() {
						this._activated = false;
					},
					
					name: name,
					title: $i18n.get((isCore ? 'core.' : '') + 'modules.' + group + '.' + name + '.title'),
					desc: $i18n.get((isCore ? 'core.' : '') + 'modules.' + group + '.' + name + '.desc'),
					group: group,
					props: props || {}
				};
				
				if(!this.items[group]) {
					this.items[group] = {
						name: group,
						title: $i18n.get('core.modules.' + group),
						modules: []
					};
				}
				
				this.items[group].modules.push(module);
				this.prepareItemsArray();
				
				settings = $session.get('settings');
				
				if(props.onConfig instanceof Function) {
					props.onConfig(module);
				}
				if(settings.modules[module.name].activated) {
					this.register(module);
				}
				
				return module;
			},
			
			register: function(module) {
				
				module.activated = true;
				
				for(let directive in module.props.directives) {
					Zemit.app.compileProvider.directive(directive, () => {
						return module.props.directives[directive]
					});
				}
				
				if(module.props.onInit instanceof Function) {
					module.props.onInit();
				}
			},
			
			prepareItemsArray: function() {
				
				this.itemsArray.splice(0, this.itemsArray.length);
				
				let result = [];
				for(let group in this.items) {
					result.push(this.items[group]);
				}
				
				this.itemsArray = this.itemsArray.concat(result);
			},
			
			getAllToArray: function() {
				return this.itemsArray;
			}
		};
		
		return factory;
	}]);
})();