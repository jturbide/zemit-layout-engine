/**
 * Zemit Shortcut
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2018-01-12
 * 
 * Listen to keydown events
 */
(function() {
	Zemit.app.factory('$shortcut', ['$rootScope', '$hook', function($rs, $hook) {
	    
		var factory = {
			
			list: {},
			
			// http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
			specialKeys: {
				'esc': 27,
				'tab': 9,
				'space': 32,
				'enter': 13,
				'backspace': 8,
				
				'scrolllock': 145,
				'capslock': 20,
				'numlock': 144,
				
				'pause': 19,
				'break': 19,
				
				'insert': 45,
				'home': 36,
				'delete': 46,
				'end': 35,
				
				'pageup': 33,
				'pagedown': 34,
	
				'left': 37,
				'up': 38,
				'right': 39,
				'down': 40,
	
				'f1': 112,
				'f2': 113,
				'f3': 114,
				'f4': 115,
				'f5': 116,
				'f6': 117,
				'f7': 118,
				'f8': 119,
				'f9': 120,
				'f10': 121,
				'f11': 122,
				'f12': 123,
			},
			
			init: function() {
				
				$rs.$zemit.on('keydown', function(event) {
									
					let isInInput = (angular.element(event.target).is('input')
						|| angular.element(event.target).is('textarea')
						|| angular.element(event.target).is('[contenteditable]')
						);
						
					if(!event.altKey && isInInput) {
						return;
					}
					
					let keys = factory.eventToKeys(event);
					factory.run(keys, event);
				});
			},
			
			eventToKeys: function(event) {
				
				let result = (event.ctrlKey || event.metaKey) ? 'ctrl+' : '';
					result += event.altKey ? 'alt+' : '';
					result += event.shiftKey ? 'shift+' : '';
				
				let specialKey = Object.keys(this.specialKeys).find(key => {
					return this.specialKeys[key] === event.which
				});
				
				result += specialKey ? specialKey : event.which;
				result = result.toLowerCase();
				
				if(result.endsWith('+')) {
					result = result.substr(0, result.length - 1);
				}
				
				return result;
			},
			
			reorderKeys: function(keys) {
				
				let splittedKeys = keys.split('+');
				let lastKey = splittedKeys[splittedKeys.length - 1];
				let reorderedKeys = splittedKeys.indexOf('ctrl') !== -1 ? 'ctrl+' : '';
					reorderedKeys += splittedKeys.indexOf('alt') !== -1 ? 'alt+' : '';
					reorderedKeys += splittedKeys.indexOf('shift') !== -1 ? 'shift+' : '';
					reorderedKeys += ['ctrl', 'alt', 'shift'].indexOf(lastKey) === -1
						? lastKey.length === 1 ? lastKey.toUpperCase().charCodeAt(0) : lastKey
						: '';
				
				reorderedKeys = reorderedKeys.toLowerCase();
				
				if(reorderedKeys.endsWith('+')) {
					reorderedKeys = reorderedKeys.substr(0, reorderedKeys.length - 1);
				}
				
				console.log(reorderedKeys);
				
				return reorderedKeys;
			},
			
			add: function(keys, title, callback) {
				
				keys = keys.toLowerCase();
				keys = this.reorderKeys(keys);
				
				if(!this.list[keys]) {
					this.list[keys] = [];
				}
				
				this.list[keys].push({
					keys: keys,
					title: title,
					callback: callback
				});
			},
			
			run: function(keys, event) {
				
				keys = keys.toLowerCase();
				keys = this.reorderKeys(keys);
				
				if(!this.list[keys]) {
					return;
				}
				
				this.list[keys].forEach(shortcut => {
					shortcut.callback(event);
				});
			}
		};
		
		$hook.add('onReady', factory.init);
		
		return factory;
	}]);
})();