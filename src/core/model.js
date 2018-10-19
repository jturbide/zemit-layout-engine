class ZmModel {
	
	constructor(key = null, data = null, extendData = null) {
		
		this.key = key;
		this.is_deleted = false;
		this.data = extendData || null;
		this.isLoading = false;
		this.isLoaded = false;
		this.isSaving = false;
		this.isSaved = false;
		this.joins = [];
		this.joinRelation = {
			single: 1,
			many: 2
		};
		this.joinType = {
			parent: 1,
			child: 2
		};
		
		// Prepare class name
		this.$injector = angular.element('zemit').injector();
		this.$util = this.$injector.get('$util');
		this.className = this.$util.snakeCase(this.constructor.name.substring(2));
		
		// Load other DIs
		this.$database = new this.$injector.get('$database')(this.className);
		this.$i18n = this.$injector.get('$i18n');
		// this.$cache = new this.$injector.get('$cache').$new();
		this.$hook = new this.$injector.get('$hook').$new();
		
		if(data) {
			this.setData(data);
		}
		
		this.load();
	}
	
	getKey() {
		return this.key;
	}
	
	setKey(key) {
		this.key = key;
	}
	
	getName() {
		return this.data.name || this.getKey();
	}
	
	setData(data) {
		
		if(typeof this.data === 'object' && this.data !== null) {
			Object.assign(this.data, data);
		}
		else {
			this.data = data;
		}
	}
	
	getData() {
		return this.data;
	}
	
	isValid() {
		return true;
	}
	
	isDeleted() {
		return this.is_deleted;
	}
	
	generateKey(reset = false) {
		
		if(!this.getKey()) {
			this.setKey(this.$util.s4() + this.$util.s4() + this.$util.s4() + this.$util.s4());
			this.applyHooks();
		}
	}
	
	setJoins(joins) {
		
		var vm = this; // Necessary for compilation
		
		angular.extend(this.joins, joins);
		
		joins.forEach((join) => {
			
			let camelizedModel = this.$util.camelize(join.model, true);
			let thisModelKey = this.className + 'Key';
			let joinModelKey = join.model + 'Key';
			
			switch(join.relation) {
				case this.joinRelation.single:
					let singleGetFunc = () => {
						
						let joinKey = this.data[joinModelKey];
						return this.$database.get(join.model);
						// return this.$cache.get(this.$database.get(join.model));
					};
					
					let singleSetFunc = (model) => {
						this.data[joinModelKey] = model.getKey();
					};
					
					eval('vm.get' + camelizedModel + ' = singleGetFunc');
					eval('vm.set' + camelizedModel + ' = singleSetFunc');
					break;
					
				case this.joinRelation.many:
					
					let manySetFunc = (model) => {
						
						let joinDb = new this.$injector.get('$database')(join.model);
						return joinDb.update(model);
					};
					
					let manyGetAllFunc = (arg) => {
						return new Promise((resolve, reject) => {
							
							let joinDb = new this.$injector.get('$database')(join.model);
							// this.$cache.get(joinDb.getAll(model => {
							joinDb.getAll(model => {
								return (!this.isDeleted() && model[thisModelKey] === this.getKey());
							}).then(results => {
								resolve(results);
							});
						});
					};
					
					eval('vm.set' + camelizedModel + ' = manySetFunc');
					eval('vm.getAll' + camelizedModel + 's = manyGetAllFunc');
					break;
			}
		});
	}
	
	toSaveFormat() {
		return {
			key: this.getKey(),
			data: this.getData(),
			constructor: this.constructor.name
		};
	}
	
	clone() {
		return eval('new ' + this.constructor.name + `(
			this.getKey(),
			this.getData()
		)`);
	}
	
	getWithoutCircularReferences() {
		
		var result = this.clone();
		var seenObjects = [];
		
		function detect(obj) {
			if (obj && typeof obj === 'object') {
				for (let key in obj) {
					if (key.startsWith('$')) {
						delete obj[key];
					}
					else {
						detect(obj[key]);
					}
				}
			}
			
			return false;
		}
		
		detect(result);
		
		return result;
	}
	
	isNew() {
		return this.getKey() === null;
	}
	
	load() {
		
		if(!this.isNew()) {
			this.applyHooks();
		}
	}
	
	applyHooks() {
		
		let camelizedModel = this.$util.camelize(this.className, true);
		let storageHookKey = camelizedModel + '_' + this.getKey();
		
		//TODO: Might execute multiple times if model is saving itselfs:
		this.$hook.add('onStorageSet' + storageHookKey, (model) => {
			this.setData(model.getData());
		});
		//this.$hook.add('onStorageRemove' + storageHookKey);
	}
	
	async remove() {
		
		this.joins.forEach(async join => {
			
			let camelizedModel = this.$util.camelize(this.className, true);
			let camelizedJoin = this.$util.camelize(join.model, true);
			let storageHookKey = camelizedModel + '_' + this.getKey();
			let thisModelKey = this.className + 'Key';
			let joinModelKey = join.model + 'Key';
			
			if(join.type === this.joinType.child) {
				
				switch(join.relation) {
					case this.joinRelation.single:
						let model = await eval('this.get' + camelizedJoin + '()');
						await model.remove();
						break;
						
					case this.joinRelation.many:
						let promises = [];
						let models = await eval('this.getAll' + camelizedJoin + 's()');
						models.forEach(model => {
							promises.push(model.remove());
						});
						
						await Promise.all(promises);
						break;
				}
			}
			else if(join.type === this.joinType.parent) {
				
				switch(join.relation) {
					case this.joinRelation.single:
						let parent = await eval('this.get' + camelizedJoin + '()');
						this.$hook.add('onStorageRemove' + camelizedJoin, (key) => {
							eval('this.getAll' + camelizedModel + 's()');
						});
						break;
						
					case this.joinRelation.many:
						
						break;
				}
			}
		});
		
		await this.$database.delete(this.getKey());
		
		this.is_deleted = true;
	}
	
	async save() {
		
		if(!this.isValid()) {
			throw new ZmError(406, this.$i18n.get('core.model.notValidate'));
		}
		
		this.generateKey();
		this.isSaving = true;
		
		await this.$database.update(this);
		
		this.isSaving = false;
		this.isSaved = true;
	}
};