/**
 * Zemit Session
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set configurations
 */
(function() {
	
	Zemit.app.factory('$session', ['$database', '$hook', '$device', function($database, $hook, $device) {
		
	    $hook.add('onBeforeUnload', () => {
	    	factory.save();
	    });
	    
	    $hook.add('onPageShow', () => {
	    	if($device.isStandalone()) {
				factory.load();
			}
	    });
	    
	    let defaultData = {
			segment: {
				key: null
			},
			settings: {
				
			}
		};
	    
		var factory = {
			
			db: null,
			data: angular.copy(defaultData),
			prepared: {},
			
			get: function(key) {
				
				if(key && !this.data[key]) {
					this.data[key] = {};
				}
				
				return this.data[key];
			},
			
			getAll: function() {
				
				return this.data;
			},
			
			set: function(key, values) {
				
				if(this.data[key] === undefined) {
					return;
				}
				
				if(this.data[key] instanceof Array) {
					this.data[key].splice(0, this.data[key].length);
					values.forEach(value => {
						this.data[key].push(value);
					});
				}
				else if(this.data[key] instanceof Object) {
				
					for(let prop in this.data[key]) {
						delete this.data[key][prop];
					}
					
					angular.merge(this.data[key], values);
				}
				else {
					this.data[key] = values;
				}
				
				if(this.prepared[key] && this.data[key] instanceof Object) {
					this.data[key] = angular.extend(angular.copy(this.prepared[key]), this.data[key]);
				}
			},
			
			prepare: function(key, values) {
				
				if(!this.data[key]) {
					this.data[key] = {};
				}
				
				if(!this.prepared[key]) {
					this.prepared[key] = {};
				}
				
				var copy = angular.copy(this.data[key]) || {};
				angular.merge(this.data[key], values, copy);
				
				var copy = angular.copy(this.prepared[key]) || {};
				angular.merge(this.prepared[key], values, copy);
			},
			
			load: function() {
				
				return new Promise((resolve, reject) => {
					factory.db.getAll().then((models) => {
						
						factory.data = angular.extend(angular.copy(defaultData), factory.data);
						
						angular.forEach(models.rows, (model) => {
							var key = model.getKey();
							var data = model.getData();
							factory.set(key, data);
						});
						
						resolve(factory.data);
					}).catch(reject);
				});
			},
			
			save: function() {
				
				var promises = [];
				angular.forEach(factory.data, (values, key) => {
					
					var data = angular.fromJson(angular.toJson(values));
					factory.db.update(new ZmSession(key, data));
				});
				
				return Promise.all(promises);
			},
			
			flush: function() {
				
				return factory.db.truncate().then(() => {
					this.data = {};
				});
			}
		};
		
		factory.db = new $database('session');
		
		return factory;
	}]);
})();