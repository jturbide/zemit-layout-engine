/**
 * Zemit Object
 * @author: <contact@dannycoulombe.com>
 * 
 * Register buttons, list, tabs that can be use all around the application.
 */
(function() {
	
	Zemit.app.factory('$object', [function() {
		
		let errAlreadyExists = 'Object ":key:" already exists';
		let errNotExisting = 'Object ":key:" does not exists';
		
		let factory = {
			
			items: [],
			
			/**
			 * Get object by key
			 */
			get: function(key) {
				
				return this.items.find(item => {
					return item.key === key;
				});
			},
			
			/**
			 * Create a new object.
			 * 
			 * @param: reference		Directive OR object
			 */
			register: function(key, reference, options = {}) {
					
				// Object not found..
				if(factory.get(key)) {
					throw new ZmError(0, errAlreadyExists.replace(':key:', key));
				}
				
				// Initalize object parameters..
				let init = function(params = {}) {
					
					let defaultParams = {
						key: key,
						childs: [],
						priority: 0,
						isDisabled: () => {
							return false;
						},
						isActive: () => {
							return false;
						},
						isVisible: () => {
							return true;
						},
						addChilds: function(childs = [], options = {}) {
							
							let vm = this;
							
							if(typeof childs === 'string') {
								childs = [childs];
							}
							
							childs.forEach(child => {
								
								let object = factory.get(child);
								if(object) {
									let newChild = object.init(options);
									vm.childs.push(newChild);
								}
								else {
									throw new ZmError(0, errNotExisting.replace(':key:', child));
								}
							});
						}
					};
					
					if(typeof reference === 'string') {
						return Object.assign(defaultParams, {
							directive: reference
						}, params);
					}
					else {
						return Object.assign(defaultParams, reference, {
							key: key
						}, params);
					}
				}
				
				// Build object..
				let item = new init(options);
				item.init = init;
				
				// Keep it in memory..
				factory.items.push(item);
				
				return item;
			},
			
			/**
			 * Instanciate a new object from an existing one.
			 */
			instanciate: function(key, options = {}) {
				
				// Get the parent object..
				let object = this.items.find(item => {
					return item.key === key;
				});
				
				// Return a copy of the parent object with new parameters..
				if(object) {
					return new object.init(options);
				}
				
				// Otherwise the object does not exists..
				throw new ZmError(0, errNotExisting.replace(':key:', key));
			}
		};
		
		return factory;
	}]);
})();