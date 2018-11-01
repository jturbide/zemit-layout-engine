class ZmError {
	
	constructor(code, message) {
		
		let error = new Error(message);
		var stack = (new Error().stack).toString().split("\n");
		stack.splice(0, 2);
		stack.forEach((message, key) => {
			stack[key] = message.trim();
		});
		
		this.code = code;
		this.message = message;
		this.stack = stack;
		
		console.error(error);
	}
};