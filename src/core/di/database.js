/**
 * Zemit Configs
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set configurations
 */
(function() {
	Zemit.app.factory('$database', ['$util', function($util) {
	
		let wrapper = function(name) {
			let factory = {
				
				db: null,
				name: null,
				
				init: function() {
					
					this.db = new PouchDB(name);
					this.name = name;
				},
				
				on: function(eventName, callback = () => {}) {
					
					this.db.changes({
						since: 'now',
						live: true,
						include_docs: true
					}).on(eventName, change => {
						
						change = eval('new Zm' + $util.camelize(factory.name, true) + '("' + change.id + '", change.doc)');
						callback(change);
					});
				},
				
				syncWith: function(db) {
					
					this.db.sync(db);
				},
				
				get: function(id) {
					
					return this.db.get(id);
				},
				
				getAll: function(options = {
					include_docs: true
				}) {
					
					return this.db.allDocs(options).then(response => {
						response.rows.forEach((row, index) => {
							response.rows[index] = eval('new Zm' + $util.camelize(factory.name, true) + '("' + row.id + '", row.doc)');
						});
						
						return response;
					});
				},
				
				insert: function(model) {
					
					return this.db.post(model.getData());
				},
				
				update: function(model) {
					
					let parsedModel = Object.assign({
						_id: model.getKey(),
						_rev: model.getData().rev
					}, model.getData());
					delete parsedModel.rev;
					
					this.db.put(parsedModel);
				},
				
				delete: function(id) {
					
					this.db.get(id).then(doc => {
						factory.db.remove(doc);
					});
				},
				
				find: function(query) {
					
				},
				
				truncate: function() {
					
					this.db.destroy().then(() => {
						factory.init();
					});
				},
				
				import: function(json) {
					
					json.docs.forEach(doc => {
						factory.update(doc._id, doc);
					});
				},
				
				export: function() {
					
					return this.getAll({
						include_docs: true,
						attachments: true
					}).then(JSON.stringify);
				},
				
				destroy: function() {
					
					return this.db.destroy();
				}
			};
			
			factory.init();
			
			return factory;
		};
		
		return wrapper;
	}]);
})();