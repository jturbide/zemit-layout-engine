/**
 * Zemit Configs
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set configurations
 */
(function() {
	Zemit.app.factory('$storage', ['$util', '$hook', '$i18n', function($util, $hook, $i18n) {
		
		var factory = {
			
			db: null,
			dbname: 'zm-layout-engine',
			objectStores: [],
			
			defineStore: function(store, indexes = []) {
				this.objectStores.push({
					name: store,
					indexes: indexes
				});
			},
			
			init: function() {
				
				return new Promise((resolve, reject) => {
					
					// TODO: IMPORTANT: A version with two sub digits will corrupt the database
					var version = parseInt('1' + Zemit.version.replace(/[^0-9]/gim, ''));
					var request = indexedDB.open(this.dbname, version);
					
					request.onupgradeneeded = (e) =>  {
						
						var db = e.target.result;
						
						angular.forEach(factory.objectStores, (store) => {
							
							let objectStore = db.createObjectStore(store.name);
							store.indexes.forEach((index, key) => {
								objectStore.createIndex(
									index.name,
									index.keyPath || index.name,
									index.params
								);
							});
						});
					}
					
					request.onsuccess = (event) =>  {
						factory.db = event.target.result;
						resolve(event);
					};
					
					request.onerror = (event) =>  {
						reject(event);
					};
					
					request.oncomplete = () =>  {
						factory.db.close();
					};
				});
			},
			
			set: function(table, model) {
				
				return new Promise((resolve, reject) => {
					
					var key = model.getKey();
					var values = model.getData();
					
					var transaction = this.db.transaction([table], 'readwrite');
					var request = transaction.objectStore(table).put(values, key);
					localStorage.setItem(table + '_' + key, angular.toJson(values));
					
					request.onsuccess = (event) =>  {
						$hook.run('onStorageSet' + $util.camelize(table, true), [model]);
						$hook.run('onStorageSet' + $util.camelize(table, true) + '_' + key, model);
						localStorage.removeItem(table + '_' + key);
						resolve(event.target.result);
					};
					
					request.onerror = (event) =>  {
						reject(event.target.result);
					};
					
					request.oncomplete = () =>  {
						factory.db.close();
					};
				});
			},
			
			update: function(table, model) {
				// TODO: Wrong... works for now but launches the hook for deletion
				this.remove(table, model).then(() => {
					this.set(table, model);
				});
			},
			
			get: function(table, key) {
				
				return new Promise((resolve, reject) => {
					
					var localStorageData = angular.fromJson(localStorage.getItem(table + '_' + key));
					if(localStorageData) {
						
						localStorage.removeItem(table + '_' + key);
						return this.set(table, key, localStorageData).then(() => {
							
							let className = (typeof localStorageData === 'Object' && localStorageData.className) || table;
							var model = eval('new Zm' + $util.camelize(className, true) + '(key, localStorageData)');
							if(eval('model instanceof Zm' + $util.camelize(className, true))) {
								resolve(localStorageData);
							}
							else {
								return reject(new ZmError($i18n.get('core.di.storage.errModelNotInitiated', { name: 'Zm' + $util.camelize(className) })));
							}
						});
					}
					else {
						
						var transaction = this.db.transaction([table]);
						var objectStore = transaction.objectStore(table);
						var request = objectStore.get(key);
						
						request.onsuccess = (event) =>  {
							
							let className = (typeof localStorageData === 'Object' && localStorageData.className) || table;
							var model = eval('new Zm' + $util.camelize(className, true) + '(key, event.target.result)');
							if(eval('model instanceof Zm' + $util.camelize(className, true))) {
								resolve(model);
							}
							else {
								return reject(new ZmError($i18n.get('core.di.storage.errModelNotInitiated', { name: 'Zm' + $util.camelize(className) })));
							}
						};
						
						request.onerror = (event) => {
							var data = localStorage.getItem(table + '_' + key);
							try {
								var json = angular.fromJson(data);
								resolve(json);
							}
							catch(e) {
								reject(event.target.result);
							}
						};
						
						request.oncomplete = () =>  {
							factory.db.close();
						};
					}
				});
			},
			
			getAll: function(table) {
				
				return new Promise((resolve, reject) => {
					
					var items = [];
					var transaction = factory.db.transaction([table]);
					var objectStore = transaction.objectStore(table);
					var request = objectStore.openCursor();
					
					request.onsuccess = (event) =>  {
						var cursor = event.target.result;
						if (cursor) {
							
							let className = (typeof cursor.value === 'Object' && cursor.value.className) || table;
							var model = eval('new Zm' + $util.camelize(className, true) + '(cursor.key, cursor.value)');
							if(eval('model instanceof Zm' + $util.camelize(className, true))) {
								items.push(model);
							}
							else {
								return reject(new ZmError($i18n.get('core.di.storage.errModelNotInitiated', { name: 'Zm' + $util.camelize(className) })));
							}
							
							cursor.continue();
						}
						else {
							resolve(items);
						}
					};
					
					request.onerror = (event) =>  {
						reject(event.target.result);
					};
					
					request.oncomplete = () => {
						factory.db.close();
					};
				});
			},
			
			find: function(table, query) {
				
				return new Promise((resolve, reject) => {
					
					var items = [];
					var transaction = factory.db.transaction([table]);
					var objectStore = transaction.objectStore(table);
					var request = objectStore.openCursor();
					
					request.onsuccess = (event) =>  {
						var cursor = event.target.result;
						if (cursor) {
							
							let className = (typeof cursor.value === 'Object' && cursor.value.className) || table;
							var model = eval('new Zm' + $util.camelize(className, true) + '(cursor.key, cursor.value)');
							if(eval('model instanceof Zm' + $util.camelize(className, true))) {
								
								if(query(model)) {
									items.push(model);
								}
							}
							else {
								return reject(new ZmError($i18n.get('core.di.storage.errModelNotInitiated', { name: 'Zm' + $util.camelize(className) })));
							}
							
							cursor.continue();
						}
						else {
							resolve(items);
						}
					};
					
					request.onerror = (event) =>  {
						reject(event.target.result);
					};
					
					request.oncomplete = () => {
						factory.db.close();
					};
				});
			},
			
			remove: function(table, key) {
				
				return new Promise((resolve, reject) => {
					var transaction = this.db.transaction([table], 'readwrite');
					var request = transaction.objectStore(table).delete(key);
					
					request.onsuccess = (event) =>  {
						localStorage.removeItem(table + '_' + key);
						$hook.run('onStorageRemove' + $util.camelize(table, true), [key]);
						$hook.run('onStorageRemove' + $util.camelize(table, true) + '_' + key, key);
						resolve(event);
					};
					
					request.onerror = reject;
					request.oncomplete = () =>  {
						factory.db.close();
					};
				});
			},
			
			truncate: function(table, key = null) {
				
				if(key) {
					return this.remove(table, key);
				}
				else {
					var transaction = this.db.transaction([table], 'readwrite');
					var request = transaction.objectStore(table).clear();
				}
			}
		};
		
		return factory;
	}]);
})();