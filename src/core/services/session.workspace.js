/**
 * Zemit Session Workspace
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set workspace session
 */
(function() {
	Zemit.app.factory('$sessionWorkspace', ['$session', '$hook', function($session, $hook) {
	    
	    $hook.add('onNewHistory', () => {
	    	factory.lastUpdate = new Date();
	    });
	    
		var factory = {
		    
		    workspace: null,
		    lastSave: null,
		    lastUpdate: null,
		    
		    load: (workspace) => {
		        this.workspace = workspace;
		    },
		    
		    isValid: () => {
		    	return true;
		        return false;
		    },
		    
		    getSegment: () => {
		    	
		    	return false;
		    },
			
			getBreadcrumbs: () => {
					
				let breadcrumbs = [];
				let workspaceKey = $session.workspace;
				let projectKey = $session.project;
				let segmentKey = $session.segment;
				
				if(workspaceKey) {
					
					let workspace = $workspace.get(workspaceKey);
					if(workspace) {
						
						breadcrumbs.push({
							label: workspace.getName()
						});
						
						if(projectKey) {
							
							let project = $workspace.getProject(projectKey);
							if(project) {
								breadcrumbs.push({
									label: project.getName()
								});
								
								if(segmentKey) {
									
									let segment = $workspace.getProject(segmentKey);
									if(segment) {
										breadcrumbs.push({
											label: segment.getName()
										});
									}
								}
							}
						}
					}
				}
				
				return breadcrumbs;
			}
		};
		
		return factory;
	}]);
})();