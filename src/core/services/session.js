/**
 * Zemit Session
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set configurations
 */
(function() {
	
	Zemit.app.run(['$storage', function($storage) {
		
		// Prepare storage store
		$storage.defineStore('session');
	}]);
	
	Zemit.app.factory('$session', ['$storage', '$hook', '$device', function($storage, $hook, $device) {
		
	    $hook.add('onBeforeUnload', () => {
	    	factory.save();
	    });
	    
	    $hook.add('onPageShow', () => {
	    	if($device.isStandalone()) {
				factory.load();
			}
	    });
	    
	    if($device.isStandalone()) {
			$hook.add(['onNewHistory', 'onUndoHistory', 'onRedoHistory'], function() {
				factory.save();
			});
		}
	    
		var factory = {
			
			data: {},
			
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
			},
			
			prepare: function(key, values) {
				
				if(!this.data[key]) {
					this.data[key] = {};
				}
				
				var copy = angular.copy(this.data[key]) || {};
				angular.merge(this.data[key], values, copy);
			},
			
			load: function() {
				
				return new Promise((resolve, reject) => {
					$storage.getAll('session').then((models) => {
						
						factory.data = angular.extend({
							segment: null,
							history: {},
							settings: {}
						}, factory.data);
						
						angular.forEach(models, (model) => {
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
					$storage.set('session', new ZmSession(key, data));
				});
				
				return Promise.all(promises);
			},
			
			flush: function() {
				
				return new Promise((resolve, reject) => {
					
					var promises = [];
					angular.forEach(factory.data, (value, key) => {
						promises.push($storage.truncate('session', key));
					});
					
					Promise.all(promises).then((result) => {
						this.data = {};
						resolve(result);
					}).catch(reject);
				});
			}
		};
		
		return factory;
	}]);
})();