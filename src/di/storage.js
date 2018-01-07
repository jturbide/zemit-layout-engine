/**
 * Zemit Configs
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set configurations
 */
(function() {
	Zemit.app.factory('$storage', [function() {
		
		var factory = {
			
			db: null,
			dbname: 'zm-layout-engine',
			objectStores: [],
			
			defineStore: function(store, settings) {
				this.objectStores.push({
					name: store,
					settings: settings
				});
			},
			
			init: function() {
				
				return new Promise((resolve, reject) => {
					
					var version = parseInt('1' + Zemit.version.replace(/[^0-9]/gim, ''));
					var request = indexedDB.open(this.dbname, version);
					
					request.onupgradeneeded = function(e) {
						
						var db = e.target.result;
						
						angular.forEach(factory.objectStores, function(store) {
							if(!db.objectStoreNames.contains(store.name)) {
								db.createObjectStore(store.name);
							}
						});
					}
					
					request.onsuccess = function(event) {
						factory.db = event.target.result;
						resolve(event.target.result);
					};
					
					request.onerror = function(event) {
						reject(event);
					};
				});
			},
			
			set: function(table, key, values) {
				
				return new Promise((resolve, reject) => {
					
					var transaction = this.db.transaction([table], 'readwrite');
					
					if(!(values instanceof Object)) {
						values = {
							value: values
						};
					}
					
					var request = transaction.objectStore(table).put(values, key);
					localStorage.setItem(table + '_' + key, angular.toJson(values));
					
					request.onsuccess = function() {
						localStorage.removeItem(table + '_' + key);
						resolve();
					};
					
					request.onerror = function(event) {
						reject(event);
					};
					
					request.oncomplete = function() {
						factory.db.close();
					};
				});
			},
			
			get: function(table, key) {
				
				return new Promise((resolve, reject) => {
					
					var localStorageData = angular.fromJson(localStorage.getItem(table + '_' + key));
					if(localStorageData) {
						
						localStorage.removeItem(table + '_' + key);
						return this.set(table, key, localStorageData).then(() => {
							resolve(localStorageData);
						});
					}
					else {
						
						var transaction = this.db.transaction([table]);
						var objectStore = transaction.objectStore(table);
						var request = objectStore.get(key);
						
						request.onsuccess = function(event) {
							resolve(event.target.result);
						};
						
						request.onerror = function(event) {
							var data = localStorage.getItem(table + '_' + key);
							try {
								var json = angular.fromJson(data);
								resolve(json);
							}
							catch(e) {
								reject(event);
							}
						};
						
						request.oncomplete = function() {
							factory.db.close();
						};
					}
				});
			},
			
			getAll: function(table) {
				
				return new Promise((resolve, reject) => {
					
					var transaction = factory.db.transaction([table]);
					var objectStore = transaction.objectStore(table);
					var request = objectStore.getAll();
					
					request.onsuccess = function(event) {
						resolve(event.target.result);
					};
					
					request.onerror = reject;
					
					request.oncomplete = function() {
						factory.db.close();
					};
				});
			}
		};
		
		return factory;
	}]);
})();