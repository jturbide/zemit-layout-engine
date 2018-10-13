class ZmError {
	
	constructor(code, message) {
		
		var stack = (new Error().stack).toString().split("\n");
		stack.splice(0, 2);
		angular.forEach(stack, (message, key) => {
			stack[key] = message.trim();
		});
		
		this.code = code;
		this.message = message;
		this.stack = stack;
	}
};