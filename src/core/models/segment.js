class ZmSegment extends ZmModel {
	
	constructor(key = null, data = null) {
		
		super(key, data, {
			name: null,
			content: null
		});
		
		this.setJoins([{
			model: 'project',
			relation: this.joinRelation.single,
			type: this.joinType.parent
		}]);
		
		if(data) {
			Object.assign(this, data);
		}
		
		return this;
	}
	
	isValid() {
		return this.data.name;
	}
	
	getContent() {
		return this.content;
	}
	
	setContent(content) {
		this.content = content;
		return this;
	}
};