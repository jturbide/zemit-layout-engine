/**
 * Zemit Module Initialization
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2018-09-24
 * 
 * Initialize all the modules
 */
(function() {
	
	Zemit.modules = {};
	
	var moduleList = [];
	Zemit.module = (name, args) => {
		moduleList.push([name, args]);
	};
	
	Zemit.app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
		
		$ocLazyLoadProvider.config({
			debug: Zemit.version === 'dev',
			events: true
		});
	}]);
	
	Zemit.app.run(['$hook', '$modules', '$util', '$injector', ($hook, $modules, $util, $injector) => {
		
		$hook.add('onReady', () => {
			
			// Update module function to execute directly onReady
			Zemit.module = (name, args = {}) => {
				
				let callbackParams = args.slice(0, args.length - 1);
				let callbackFunc = args.slice(args.length - 1, args.length)[0];
				let injectors = [];
				callbackParams.forEach((param) => {
					injectors.push($injector.get(param));
				});
				let props = callbackFunc.apply(null, injectors);
				
				$modules.config(name, props.group, props);
			};
			
			// Initialize previously added modules
			if(moduleList.length > 0) {
				moduleList.forEach((module) => {
					Zemit.module.apply(null, module);
				});
			}
		});
	}])
	
	Zemit.app.factory('$modules', ['$ocLazyLoad', '$session', '$hook', '$i18n', '$util', function($ocLazyLoad, $session, $hook, $i18n, $util) {
		
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
					
					if(Zemit.version === 'dev') {
						
						// Initialize a new module
						Zemit.modules[name] = angular.module('zm' + $util.camelize(name, true), []);
						
						// Lazy-load the newly created module
						$ocLazyLoad.load({
							name: name,
							rerun: true,
							reconfig: true,
							files: [
								'./modules/' + name + '/' + name + '.js',
								'./modules/' + name + '/' + name + '.css'
							]
						});
					}
				});
			},
			
			config: function (name, group = 'misc', props = {}, isCore= false) {
				
				let options = {
					modules: {}
				};
				options.modules[name] = {
					activated: false
				};
				$session.prepare('settings', options);
				
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
				
				let thumbnail = './' + (isCore ? 'core/' : '') + 'modules/' + name + '/' + name + '.png';
				let image = new Image();
				image.src = thumbnail;
				image.onload = () => {
					module.thumbnail = thumbnail;
				};
				image.onerror = () => {
					module.thumbnail = 'data:image/png;base64,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';
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