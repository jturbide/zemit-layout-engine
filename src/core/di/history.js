/**
 * Zemit History Manager
 * @author: <contact@dannycoulombe.com>
 * 
 * Keeps track of every changes. Undo/redo capabilities
 */
(function() {
	Zemit.app.factory('$history', ['$diff', '$session', '$hook', '$injector', '$timeout', '$storage', function($diff, $session, $hook, $injector, $timeout, $storage) {
	    
	    $hook.add('onSegmentLoad', function() {
	    	var changes = $session.get('history');
			factory.load(changes);
	    });
	    
	    $hook.add('onBeforeUnload', function() {
	    	var changes = factory.dump();
	    	$session.set('history', changes);
	    });
	    
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
					
					$hook.run('onNewHistory');
					
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
				
				$timeout(function() {
					var $zm = $injector.get('$zm');
					$zm.widget.updateWidgetStates();
				});
				
				$hook.run('onUndoHistory');
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
				
				$timeout(function() {
					var $zm = $injector.get('$zm');
					$zm.widget.updateWidgetStates();
				});
				
				$hook.run('onRedoHistory');
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
			},
			
			/**
			 * Get all changes in memory changes
			 */
			dump: function() {
				
				var changes = [];
				angular.forEach(factory.changes, function(change) {
					
					changes.push({
						diff: change.diff,
						timestamp: change.timestamp
					});
				});
				
				return {
					changes: changes,
					position: this.position
				};
			},
			
			/**
			 * Load all changes from memory
			 */
			load: function(data) {
				
				var $zm = $injector.get('$zm');
				var $segment = $injector.get('$segment');
				var scope = $segment.segment.data.content;
				var changes = [];
				angular.forEach(data.changes, function(change) {
					
					changes.push({
						diff: change.diff,
						scope: scope,
						timestamp: change.timestamp
					});
				});
				
				this.changes = changes;
				this.position = data.position || 0;
				
				this.canRedo = this.position < this.changes.length;
				this.canUndo = this.position > 0;
			},
			
			flush: function() {
				
				this.changes = [];
				this.position = 0;
				this.canUndo = false;
				this.canRedo = false;
			}
		};
		
		return factory;
	}]);
})();