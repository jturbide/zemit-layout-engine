/**
 * Zemit Workspaces
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set workspaces
 */
(function() {
	
	Zemit.app.run(['$storage', function($storage) {
		
		// Prepare storage store
		$storage.defineStore('workspace');
		$storage.defineStore('project');
		$storage.defineStore('segment');
	}]);
	
	Zemit.app.factory('$workspace', ['$storage', '$session', '$socket', '$i18n', function($storage, $session, $socket, $i18n) {
	    
		var factory = {
			
			data: [],
			
			init: async function() {
				
				this.data = await this.getAll();
				
				angular.forEach(this.data, (workspace) => {
					if(workspace.getData().env === 'remote') {
						workspace.connect();
					}
				});
			},
			
			add: function(workspace) {
				
				return new Promise((resolve, reject) => {
					
					if(workspace.getData().env === 'remote'
					&& this.get(workspace.getData().host)) {
						
						throw new ZmError(409, $i18n.get('core.services.workspace.errAlreadyExists'));
					}
					
					let callback = () => {
						
						workspace.save().then(() => {
							
							this.data.push(workspace);
							resolve();
						});
					};
					
					if(workspace.getData().env === 'remote') {
						
						$socket.addConnection(workspace)
							.then((socket) => {
								callback()
							}).catch((err) => reject(err));
					}
					else {
						callback();
					}
				});
			},
			
			// get: (key) => {
				
			// 	let model = this.data.find((workspace) => {
			// 		return workspace.getKey() === key;
			// 	});
				
			// 	return model;
			// },
			
			getAll: async () => {
				
				if(this.data) {
					return this.data;
				}
				
			    var workspaces = await $storage.getAll('workspace');
			    this.data = workspaces;
			    
			    return this.data;
			},
			
			refresh: async () => {
				
				// var workspaces = await $storage.getAll('workspace');
				
				// this.data.splice(0, this.data.length);
				
				// workspaces.forEach(workspace => {
				// 	this.data.push(workspace);
				// });
			},
			
			update: (workspace) => {
				
				return new Promise((resolve, reject) => {
					
					let key = workspace.getKey();
					let callback = () => {
						workspace.save().then(() => {
							factory.refresh(workspace);
							resolve();
						});
					};
					
					if(workspace.getData().env === 'remote') {
						
						var currentWorkspace = factory.get(key);
						var originalWorkspace = currentWorkspace.clone();
						
						if(currentWorkspace.getData().host !== workspace.getData().host
						|| currentWorkspace.getData().user !== workspace.getData().user
						|| currentWorkspace.getData().pass !== workspace.getData().pass) {
						
							currentWorkspace.setData(workspace.getData());
							currentWorkspace.disconnect().then(() => {
								currentWorkspace.connect().then(callback).catch((err) => {
									
									currentWorkspace.setData(originalWorkspace.getData());
									currentWorkspace.connect().then(() => {
										reject(new ZmError(404, $i18n.get('core.services.workspace.errUnableConnectCred')));
									});
								});
							});
						}
						else {
							callback();
						}
					}
					else {
						callback();
					}
				});
			},
			
			remove: (key) => {
				
				// return new Promise((resolve, reject) => {
				// 	let deleteIndex = null;
				// 	factory.data.find(function(workspace, index) {
				// 		if(workspace.getKey() === key) {
				// 			workspace.disconnect();
				// 			deleteIndex = index;
				// 		}
				// 	});
				// 	deleteIndex !== null && factory.data.splice(deleteIndex, 1);
					
				// 	$storage.remove('workspace', key)
				// 		.then(resolve)
				// 		.catch(reject);
				// });
			}
		};
		
		return factory;
	}]);
})();