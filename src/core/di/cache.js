/**
 * Zemit Cache
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Cache initialization
	 */
	Zemit.app.run(['$debug', '$hook', '$i18n', function($debug, $hook, $i18n) {
		$hook.add('onReady', () => $debug.init('cache', $i18n.get('core.di.cache.debugTitle')));
	}]);
	
	Zemit.app.factory('$cache', ['$hook', '$util', '$debug', function($hook, $util, $debug) {
		
		var vm = {
			
			data: {},
			
			$new: function() {
				return angular.copy(defaultVm);
			},
			
			update: function(results, key) {
				
				if(results instanceof Array) {
						
					if(!this.data[key]) {
						this.data[key] = [];
					}
				
					// Update cache without losing its memory reference
					this.data[key].splice(0, this.data[key].length);
					results.forEach((result) => {
						this.data[key].push(result);
					});
				}
				else if(results instanceof Object) {
					
					if(!this.data[key]) {
						this.data[key] = eval('new ' + results.constructor.name);
					}
					
					// Update cache without losing its memory reference
					let keys = Object.keys(this.data[key]);
					keys.forEach((k) => {
						delete this.data[key][k];
					});
					
					Object.assign(this.data[key], results);
				}
				else {
					this.data[key] = results
				}
			},
				
			get: function(promise) {
				return new Promise((resolve, reject) => {
					promise.then((results) => {
						
						let models = results;
						if(!(results instanceof Array)) {
							models = [results];
						}
						// else {
							
						// 	let cacheKey = camelizedModel;
						// 	let cacheId = 'cache_' + modelName;
							
						// 	$hook.add('onStorageSet' + modelName,
						// 		model => this.update(results, cacheKey),
						// 		cacheId
						// 	);
						// 	$hook.add('onStorageRemove' + modelName,
						// 		models => this.update(results, cacheKey),
						// 		cacheId
						// 	);
						// }
						
						models.forEach(model => {
							
							let camelizedModel = $util.camelize(model.className, true);
							let cacheKey = camelizedModel + '_' + model.getKey();
							let cacheId = 'cache_' + cacheKey;
							let camelizedKey = camelizedModel + '_' + model.getKey();
							
							if(!this.data[cacheKey]) {
								this.data[cacheKey] = results instanceof Array
									? []
									: eval('new Zm' + $util.camelize(model.className, true) + '()');
							}
							
							if(!$hook.exists(cacheId)) {
								
								// $hook.add('onStorageSet' + camelizedKey,
								// 	model => this.update(model, cacheKey),
								// 	cacheId
								// );
								$hook.add('onStorageRemove' + camelizedKey,
									models => this.remove(cacheKey),
									cacheId
								);
								
								$debug.log('cache', 'HOOK', 'onStorageSet' + camelizedModel);
								$debug.log('cache', 'HOOK', 'onStorageRemove' + camelizedModel);
							}
							
							this.update(results, cacheKey);
							resolve(results);
						});
					});
				});
			},
			
			remove: function(key) {
				
				delete this.data[key];
			}
		};
		
		var defaultVm = angular.copy(vm);
		return vm;
	}]);
})();