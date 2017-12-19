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
			dbname: 'zemit-layout-engine',
			objectStores: [
				'config'	
			],
			
			init: function(callback) {
				var request = indexedDB.open(this.dbname, 1);
				
				request.onupgradeneeded = function(e) {
					
		            var db = e.target.result;
		 
					angular.forEach(factory.objectStores, function(store) {
						if(!db.objectStoreNames.contains(store)) {
			                db.createObjectStore(store);
			            }
					});
		        }
				
				request.onsuccess = function(event) {
					factory.db = event.target.result;
					callback && callback();
				};
			},
			
			set: function(table, key, value, onSuccess) {
				
				var transaction = this.db.transaction([table], "readwrite");
				var request = transaction.objectStore(table).put(value, key);
				localStorage.setItem(table + '_' + key, value);
				
				request.onsuccess = function() {
					localStorage.removeItem(table + '_' + key);
					onSuccess && onSuccess();
				};
				//request.onerror = onError;
			},
			
			get: function(table, key, onSuccess) {
				
				var localStorageData = localStorage.getItem(table + '_' + key)
				if(localStorageData) {
					onSuccess && onSuccess(localStorageData);
					localStorage.removeItem(table + '_' + key);
				}
				else {
					var transaction = this.db.transaction([table]);
					var objectStore = transaction.objectStore(table);
					var request = objectStore.get(key);
					
					request.onsuccess = function(event) {
						onSuccess && onSuccess(event.target.result);
					};
					request.onerror = function(event) {
						var data = localStorage.getItem(table + '_' + key);
						onSuccess && onSuccess(data);
					};
				}
			}
		};
		
		return factory;
	}]);
})();