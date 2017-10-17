/**
 * Zemit History Manager
 * @author: <contact@dannycoulombe.com>
 * 
 * Keeps track of every changes. Undo/redo capabilities
 */
(function() {
	Zemit.app.factory('$history', ['$diff', function($diff) {
	    
		var factory = {
			
			position: 0,
			canUndo: false,
			canRedo: false,
			changes: [],
			
			/**
			 * Log a new change
			 */
			transaction: function(scope, parentCallback) {
				
				var originalScope = angular.copy(scope);
				var callback = function() {
					
					// Get difference and prepare new log object
					var newScope = angular.copy(scope);
					var diff = $diff.getDifferences(originalScope, newScope);
					
					if(!diff) {
						return;
					}
					
					var log = {
						diff: diff,
						scope: scope,
						timestamp: new Date()
					};
					
					// Insert log
					factory.changes.splice(factory.position, 0, log);
					
					// Remove all changes after the latest inserted log
					factory.clearAfter(factory.position);
					
					factory.position++;
					factory.canUndo = true;
					
					console.log('HISTORY', diff);
				};
				
				if(parentCallback instanceof Function) {
					parentCallback();
					return callback();
				}
				else {
					return callback;
				}
			},
			
			/**
			 * Undo latest change
			 */
			undo: function() {
				
				if(!this.canUndo) {
					return;
				}
				
				// Retrieve log and apply changes
				var log = this.changes[this.position - 1];
				$diff.applyDifferences(log.scope, log.diff, true);
				this.position--;
				
				if(this.position === 0) {
					this.canUndo = false;
				}
				
				this.canRedo = true;
			},
			
			/**
			 * Redo change
			 */
			redo: function() {
				
				if(!this.canRedo) {
					return;
				}
				
				// Retrieve log and apply changes
				var log = this.changes[this.position];
				$diff.applyDifferences(log.scope, log.diff);
				this.position++;
				
				if(this.position === this.changes.length) {
					this.canRedo = false;
				}
				
				this.canUndo = true;
			},
			
			/**
			 * Remove all changes after given index
			 */
			clearAfter: function(index) {
				
				while((factory.changes.length - 1) > index) {
					factory.changes.splice(factory.changes.length - 1, 1);
				}
				
				if(factory.position > index) {
					factory.position = index;
				}
				
				factory.canRedo = false;
			}
		};
		
		return factory;
	}]);
})();