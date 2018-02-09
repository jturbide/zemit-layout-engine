class ZmUser extends ZmModel {
	
	constructor(key = null, data = null) {
		
		super(key, data, {
			email: null,
			password: null,
			firstName: null,
			lastName: null
		});
	}
};