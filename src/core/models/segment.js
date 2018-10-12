class ZmSegment extends ZmModel {
	
	constructor(key = null, data = null) {
		
		super(key, data, {
			name: null,
			content: {
				childs: []
			}
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
		return this.data.content;
	}
	
	setContent(content) {
		this.data.content = content;
		return this;
	}
	
	cleanContent() {
		this.data.content = angular.fromJson(angular.toJson(this.data.content));
	}
	
	getTotalWidgets() {
		
		function count(item, callback, recursive) {
								
			recursive = recursive === undefined ? true : recursive;
			
			var found = [];
			var getChilds = function(widget) {
				angular.forEach(widget.childs, function(child, ckey) {
					
					found.push(child);
					
					if(recursive) {
						getChilds(child);
					}
				});
			};
			getChilds(item);
			
			// Execute callback function on all widgets found
			angular.forEach(found, function(widget) {
				callback(widget);
			});
		};
		
		var total = 0;
		count(this.getContent(), function(widget) {
			total++;
		}, true);
		
		return total;
	}
};