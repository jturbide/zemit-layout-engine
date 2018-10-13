/**
 * Zemit Session Workspace
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set workspace session
 */
(function() {
	Zemit.app.factory('$segment', ['$session', '$hook', '$rootScope', '$storage', '$modal', '$file', '$history', '$i18n', function($session, $hook, $rs, $storage, $modal, $file, $history, $i18n) {
		
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
				
				let callback = () => {
					
					factory.segment.setKey(null);
					factory.segment.setContent({
						childs: []
					});
					factory.project = null;
					factory.workspace = null;
					
					factory.updateBreadcrumbs();
					
					$session.set('segment', null);
				};
				
				if(factory.isValid()) {
					factory.segment.cleanContent();
					factory.segment.save().then(callback);
				}
				else {
					callback();
				}
			},
			
			setContent: (content) => {
				
				factory.segment.setContent(content);
				$hook.run('onSegmentLoad', factory.segment);
			},
			
			setSegment: (segment) => {
				
				let callback = () => {
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
				};
				
				if(factory.isValid()) {
					factory.segment.cleanContent();
					factory.segment.save().then(callback);
				}
				else {
					callback();
				}
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
			},
			
			export: function(filename) {
				
				if(!filename) {
					filename = 'zmle-export.' + new Date().toISOString();
				}
				
				var history = $history.dump();
				var content = this.segment.getContent();
				var data = angular.toJson({
					history: history,
					content: content,
					version: Zemit.version
				});
				
				$file.downloadAs('text/json', filename + '.json', data);
				
				$modal.info({
					title: $i18n.get('core.di.zm.modalExportTitle'),
					content: $i18n.get('core.di.zm.modalExportContent')
				});
			},
			
			import: function() {
				
				$file.promptFileDialog(function(file) {
					
					var reader = new FileReader();
					reader.onload = function(event) {
						
						try {
							var json = event.target.result;
							var data = angular.fromJson(json);
							
							if(data.version !== Zemit.version) {
								
								$modal.warning({
									title: $i18n.get('core.di.zm.importVerMismatchTitle'),
									content: $i18n.get('core.di.zm.importVerMismatchContent', {
										currentVersion: Zemit.version,
										importedVersion: data.version
									})
								});
							}
							else {
								// factory.session.flushAll();
								$history.load(data.history);
								factory.setContent(data.content);
								
								$modal.info({
									title: $i18n.get('core.di.zm.importCompleteTitle'),
									content: $i18n.get('core.di.zm.importCompleteContent')
								});
							}
						}
						catch(e) {
							
							$modal.error({
								title: $i18n.get('core.di.zm.errImportWrongFormatTitle'),
								content: $i18n.get('core.di.zm.errImportWrongFormatContent')
							});
						}
					}
					reader.readAsText(file);
				});
			}
		};
		
		return factory;
	}]);
})();