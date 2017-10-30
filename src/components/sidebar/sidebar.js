(function() {
	Zemit.app.directive('zmSidebar', ['$config', function($config) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/sidebar.html',
			link: function ($s, $e, attrs) {
				
				$s.sidebar = $s;
				
				var config = $config.get();
				$config.prepare({
					sidebar: {
						tabs: {
							workspace: {
								visible: false
							},
							advanced: {
								visible: false
							},
							widgets: {
								visible: false
							}
						}
					}
				});
				
				$s.tabs = {
					
					showContent: false,
					
					init: function() {
						this.updateShowContent();
					},
					
					hideAll: function() {
						
						this.hidden = true;
					},
					
					unhideAll: function() {
						this.hidden = false;
					},
					
					closeAll: function() {
						
						angular.forEach(config.sidebar.tabs, function(tab, key) {
							tab.visible = false;
						});
						
						this.updateShowContent();
					},
					
					updateShowContent: function() {
						
						var show = false;
						
						angular.forEach(config.sidebar.tabs, function(tab) {
							if(tab.visible) {
								show = true;
							}
						});
						
						this.showContent = show;
						
						if(show) {
							this.unhideAll();
						}
					},
					
					toggle: function(name) {
						
						angular.forEach(config.sidebar.tabs, function(tab, key) {
							if(key !== name) {
								tab.visible = false;
							}
						});
						
						config.sidebar.tabs[name].visible = !config.sidebar.tabs[name].visible;
						this.updateShowContent();
					}
				};
				
				$s.tabs.init();
				
				$s.sidebar.tabs = $s.tabs;
			}
		};
	}]);
})();