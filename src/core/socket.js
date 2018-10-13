class ZmSocket {
	
	constructor(workspace) {
		
		this.workspace = workspace || new ZmWorkspace();
		this.socket = null;
		this.app = null;
		this.services = null;
		
		return this.connect();
	}
	
	/**
	 * Connect to 
	 */
	connect() {
		
		return new Promise((resolve, reject) => {
			
			let model = this;
			let workspace = this.workspace.getData();
			let socketIoPath = '//' + workspace.host + '/socket.io/socket.io.js';
			let onload = () => {
				try {
					
					this.socket = window.io(workspace.host);
					this.app = window.feathers();
					
					// Register socket.io
					this.app.configure(feathers.socketio(this.socket));
					
					// Handle reconnection
					this.socket.on('connect', function() {
						model.workspace.setConnected(true);
					});
					
					// On disconnection, remove SocketIO reference from DOM
					this.socket.on('disconnect', function () {
						model.workspace.setError(new ZmError(404, this.$i18n.get('core.classes.errConnLost')));
						angular.element('script[src="' + socketIoPath + '"]').remove();
					});
					
					// Get the different services
					this.services = {
						messages: this.app.service('messages'),
						workspace: this.app.service('workspace'),
						session: this.app.service('session'),
						media: this.app.service('media')
					};
					
					resolve(this);
				}
				catch(err) {
					
					reject(new ZmError(401, this.$i18n.get('core.classes.errUserPassIncorrect')));
				}
			};
			
			// If no Socket.IO script injected yet, load host's.
			let ioScript = angular.element('script[src="' + socketIoPath + '"]');
			if(ioScript.length === 0) {
				
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.async = true;
				script.onload = onload;
				script.onabort = (response) => {
					angular.element('script[src="' + socketIoPath + '"]').remove();
					
					// Error: Connection timeout
					reject(new ZmError(408, this.$i18n.get('core.classes.errConnTimeout')));
				};
				script.onerror = (response) => {
					angular.element('script[src="' + socketIoPath + '"]').remove();
					
					// Error: Host not found
					reject(new ZmError(404, this.$i18n.get('core.classes.errNotResponding')));
				};
				
				script.src = socketIoPath;
				document.getElementsByTagName('head')[0].appendChild(script);
			}
			else {
				
				reject(new ZmError(409, this.$i18n.get('core.classes.errAlreadyConn')));
			}
		});
	}
	
	disconnect() {
		
		return new Promise((resolve, reject) => {
			this.socket.on('disconnect', () => {
				resolve();
			});
			(this.socket && this.socket.disconnect()) || resolve();
		});
	}
};