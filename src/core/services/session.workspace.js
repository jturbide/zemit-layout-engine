/**
 * Zemit Session Workspace
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set workspace session
 */
(function() {
	Zemit.app.factory('$sessionWorkspace', ['$session', '$hook', '$rootScope', '$storage', function($session, $hook, $rs, $storage) {
		
		$hook.add('onNewHistory', () => {
			factory.lastUpdate = new Date();
		});
		
		$hook.add('onReady', () => {
			
			var segmentKey = $session.get('segment');
			
			if(segmentKey) {
				let segment = $storage.get('segment', segmentKey).then(segment => {
					if(segment) {
						factory.setSegment(segment);
					}
				});
			}
		})
		
		$hook.add('onBeforeUnload', function() {
			if(factory.segment.getKey()) {
				factory.segment.cleanContent();
				factory.segment.save();
			}
		});
		
		$hook.add('onStorageRemoveSegment', keys => {
			keys.forEach(key => {
				if(key === factory.segment.getKey()) {
					factory.closeSegment();
				}
			});
		});
		
		var factory = {
			
			breadcrumbs: [],
			
			segment: null,
			project: null,
			workspace: null,
			
			init: function() {
				this.segment = new ZmSegment();
			},
			
			isValid: function() {
				
				return this.segment
					&& this.segment.getKey()
					&& this.project
					&& this.workspace;
			},
			
			closeSegment: function() {
				
				this.segment.setKey(null);
				this.segment.setContent({
					childs: []
				});
				this.project = null;
				this.workspace = null;
				
				this.updateBreadcrumbs();
				
				$session.set('segment', null);
			},
			
			setSegment: (segment) => {
				
				if(factory.isValid()) {
					factory.segment.cleanContent();
					factory.segment.save();
				}
				
				segment.getProject().then(project => {
					project.getWorkspace().then(workspace => {
						
						factory.segment.setKey(segment.getKey());
						factory.segment.setData(segment.getData());
						factory.segment.setContent(segment.getContent());
						factory.project = project;
						factory.workspace = workspace;
						factory.updateBreadcrumbs();
						
						$session.set('segment', segment.getKey());
						
						$hook.run('onSegmentLoad', factory.segment);
						
						$rs.$digest();
					});
				});
			},
			
			updateBreadcrumbs: function() {
				
				this.breadcrumbs.splice(0, this.breadcrumbs.length);
				
				if(this.workspace) {
					
					this.breadcrumbs.push({
						label: this.workspace.getName()
					});
					
					if(this.project) {
						
						this.breadcrumbs.push({
							label: this.project.getName()
						});
						
						if(this.segment) {
							
							this.breadcrumbs.push({
								label: this.segment.getName()
							});
						}
					}
				}
			},
			
			getBreadcrumbs: function() {
				
				return this.breadcrumbs;
			}
		};
		
		return factory;
	}]);
})();