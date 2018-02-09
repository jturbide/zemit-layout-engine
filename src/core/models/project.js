class ZmProject extends ZmModel {
	
	constructor(key = null, data = null) {
		
		super(key, data, {
			name: null,
		});
		
		this.setJoins([{
			model: 'workspace',
			relation: this.joinRelation.single,
			type: this.joinType.parent
		}, {
			model: 'segment',
			relation: this.joinRelation.many,
			type: this.joinType.child
		}]);
		
		if(data) {
			Object.assign(this, data);
		}
		
		return this;
	}
	
	isValid() {
		
		//let workspace = this.getWorkspace();
		let name = this.getData().name;
		
		return name && name.trim() !== ''
			//&& workspace && !workspace.getProject(this.name) || false;
	}
};