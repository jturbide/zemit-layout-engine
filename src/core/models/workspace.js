class ZmWorkspace extends ZmModel {
	
	constructor(key = null, data = null) {
		
		super(key, data, {
			env: null,
			name: null,
			host: null,
			user: null,
			pass: null,
		});
		
		this.setJoins([{
			model: 'project',
			relation: this.joinRelation.many,
			type: this.joinType.child
		}]);
		
		// this.projects = [];
		this.connected = false;
		this.connecting = false;
		this.error = null;
		this.socket = null;
		
		return this;
	}
	
	isValid() {
		var data = this.getData();
		return (data.env === 'browser' && data.name !== null && data.name.trim() !== '')
			|| (data.env === 'remote' && this.$util.isValidHost(data.host));
	}
	
	connect() {
		
		var vm = this;
		
		this.connecting = true;
		
		return new Promise((resolve, reject) => {
			new ZmSocket(this).then((socket) => {
				
				socket.services.messages.on('connection', message => {
					console.log('Someone just connected', message);
				});
				
				// Log newly created messages
				socket.services.messages.on('created', message => {
					console.log('Someone created a messages', message);
				});
				
				socket.socket.on('disconnect', function () {
					vm.setConnected(false);
				});
				
				// Create a new message and then get a list of all messages
				socket.services.messages.create({
					text: 'Browser opened at timestamp: ' + new Date().getTime()
				}).then(() => socket.services.messages.find())
				  .then(page => {
					
					console.log('Messages', page);
					resolve(socket);
				});
				
				this.socket = socket;
				this.connecting = false;
				this.setConnected(true);
				
			}).catch((reason) => {
				
				this.disconnect();
				this.connecting = false;
				this.setError(reason);
				reject(reason);
			});
		});
	}
	
	reconnect() {
		
		this.setConnected(false);
		this.setError(null);
		
		return new Promise((resolve, reject) => {
			this.disconnect().then(() => {
				this.connect().then(resolve);
			});
		});
	}
	
	disconnect() {
		return new Promise((resolve, reject) => {
			if(this.socket) {
				this.socket.disconnect().then(() => {
					this.setConnected(false);
					resolve();
				})
			}
			else {
				resolve();
			}
		});
	}
	
	getName() {
		
		let data = this.getData();
		if(data.env === 'remote') {
			return data.name || data.host;
		}
		
		return data.name;
	}
	
	getSocket() {
		return this.socket;
	}
	
	setSocket(socket) {
		this.socket = socket;
	}
	
	setConnected(boolean) {
		this.connected = boolean;
		
		if(boolean) {
			this.setError(null);
		}
		
		return this;
	}
	
	isConnected() {
		return this.connected;
	}
	
	isConnecting() {
		return this.connecting;
	}
	
	setError(error) {
		this.error = error;
		return this;
	}
	
	getError() {
		return this.error;
	}
	
	hasError() {
		return this.error !== null;
	}
};