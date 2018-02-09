/**
 * Zemit Socket
 * @author: <contact@dannycoulombe.com>
 * 
 * Send/listen sockets
 */
(function() {
	
	Zemit.app.factory('$socket', ['$storage', function($storage) {
		
		var factory = {
			
			data: {},
			
			addConnection: (workspace) => {
				return new Promise((resolve, reject) => {
					
					var data = factory.get(workspace.getData().host);
					if(data) {
						data.socket.disconnect();
					}
					
					factory.connect(workspace)
						.then(resolve)
						.catch(reject);
				});
			},
			
			connect: (workspace) => {
				return new Promise((resolve, reject) => {
					workspace.connect().then((socket) => {
						let key = workspace.getData().host;
						factory.data[key] = {
							workspace: workspace,
							socket: socket
						};
						resolve(factory.get(key));
					}).catch(reject);
				});
			},
			
			get: function(id) {
				return this.data[id];
			}
		};
		
		return factory;
	}]);
})();